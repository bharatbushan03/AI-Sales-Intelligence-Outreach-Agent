import { logger } from '../../utils/logger';

export class GuardrailsManager {
  private static instance: GuardrailsManager;

  private constructor() {}

  public static getInstance(): GuardrailsManager {
    if (!GuardrailsManager.instance) {
      GuardrailsManager.instance = new GuardrailsManager();
    }
    return GuardrailsManager.instance;
  }

  /**
   * Validates a response text against JSON parse rules and optional type checking constraints.
   */
  public validate(
    text: string,
    schema?: Record<string, 'string' | 'number' | 'boolean' | 'array' | 'object'>,
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!text || text.trim() === '') {
      return { isValid: false, errors: ['Generation output is empty or whitespace.'] };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (err: any) {
      logger.warn('Guardrails: malformed JSON text encountered:', { text });
      return { isValid: false, errors: [`Malformed JSON structure: ${err.message}`] };
    }

    // Optional schema properties key/type validation
    if (schema && parsed) {
      for (const [key, expectedType] of Object.entries(schema)) {
        if (!(key in parsed)) {
          errors.push(`Missing required field "${key}"`);
          continue;
        }

        const val = parsed[key];
        if (expectedType === 'array') {
          if (!Array.isArray(val)) {
            errors.push(`Field "${key}" must be of type "array", got "${typeof val}"`);
          }
        } else if (expectedType === 'object') {
          if (val === null || typeof val !== 'object' || Array.isArray(val)) {
            errors.push(
              `Field "${key}" must be of type "object", got "${val === null ? 'null' : typeof val}"`,
            );
          }
        } else {
          if (typeof val !== expectedType) {
            errors.push(`Field "${key}" must be of type "${expectedType}", got "${typeof val}"`);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
