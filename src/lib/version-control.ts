import { adminDb } from './firebase-admin';

export interface DocumentSnapshot {
  id?: string;
  documentId: string;
  collectionName: string;
  version: number;
  data: Record<string, any>;
  changelog: string;
  createdAt: string;
  createdBy: string;
}

export class VersionControlService {
  private static get collection() {
    return adminDb.collection('document_versions');
  }

  /**
   * Captures a document state snapshot.
   */
  public static async snapshot(
    collectionName: string,
    documentId: string,
    data: Record<string, any>,
    changelog: string,
    createdBy: string,
  ): Promise<number> {
    // 1. Get next version number
    const snapshotList = await this.collection
      .where('documentId', '==', documentId)
      .where('collectionName', '==', collectionName)
      .get();

    const currentMax = snapshotList.docs.reduce((max, doc) => {
      const v = doc.data().version || 0;
      return v > max ? v : max;
    }, 0);

    const nextVersion = currentMax + 1;

    // 2. Save snapshot record
    const snapshotRecord: DocumentSnapshot = {
      documentId,
      collectionName,
      version: nextVersion,
      // Strip metadata properties from the data payload
      data: { ...data, id: documentId },
      changelog,
      createdAt: new Date().toISOString(),
      createdBy,
    };

    await this.collection.add(snapshotRecord);
    return nextVersion;
  }

  /**
   * Lists historical snapshot versions of a document.
   */
  public static async getVersions(
    collectionName: string,
    documentId: string,
  ): Promise<DocumentSnapshot[]> {
    const snapshotList = await this.collection
      .where('documentId', '==', documentId)
      .where('collectionName', '==', collectionName)
      .get();

    const list = snapshotList.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<DocumentSnapshot, 'id'>),
    }));

    return list.sort((a, b) => b.version - a.version);
  }

  /**
   * Rolls back a target document to the state of a specified version.
   */
  public static async rollback(
    collectionName: string,
    documentId: string,
    version: number,
    actor: string,
  ): Promise<Record<string, any>> {
    const versions = await this.getVersions(collectionName, documentId);
    const match = versions.find((v) => v.version === version);
    if (!match) {
      throw new Error(`Version ${version} of document ${documentId} in ${collectionName} was not found.`);
    }

    const restorePayload: any = {
      ...match.data,
      updatedAt: new Date(),
    };
    delete restorePayload.id;

    // 1. Update the document in its target collection
    await adminDb.collection(collectionName).doc(documentId).set(restorePayload, { merge: true });

    // 2. Log rollback operation as a new snapshot version
    await this.snapshot(
      collectionName,
      documentId,
      restorePayload,
      `Rollback to version ${version} (Triggered by: ${actor})`,
      actor,
    );

    return { id: documentId, ...restorePayload };
  }
}
