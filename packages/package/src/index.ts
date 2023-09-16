/**
 * A mapping of error names to messages.
 */
type Errors = Record<string, string[]>;

/**
 * A validation function for a field.
 */
type Validator<T> = (val: T) => string | undefined;

export class ValidationErrors {
  /**
   * A mapping of error names to messages.
   */
  #errors: Errors = {};

  /**
   * Adds an error to the errors map.
   *
   * @param {string} name - the logical group for the error
   * @param {string} message - the message for the error
   */
  add(name: string, message: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    this.#errors[name] ??= [];
    this.#errors[name].push(message);
  }

  /**
   * Returns the errors map.
   *
   * @returns {Errors} Returns `{}` if there are not any errors.
   */
  entries(): Errors {
    return this.#errors;
  }
}

/**
 * The `context` field accepts a string to specify a particular context. This allows you
 * to only run a subset of validations for a particular context.
 */
export type ValidationOptions = { context: string };

/**
 * Base class that provides validation capabilities.
 *
 * Subclasses implement #validation.
 */
export abstract class ValidationObject<Validated = Record<string, never>> {
  /**
   * Holds any errors from calling #validate.
   */
  errors = new ValidationErrors();

  /**
   * An optional adapter.
   *
   * This will apply to any Validator used with #validates.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter?: (validation: any) => Validator<any> = undefined;

  /**
   * The validations to perform. Defined in the subclass.
   *
   * @param {ValidationOptions} [options] - Additional options for the validation
   * @param {string} options.context - The context for the validation. This allows you to only run a subset of validations for a particular context.
   */
  protected abstract validation(options?: ValidationOptions): void;

  /**
   * Runs the subclass defined #validation method and returns the object's validation status.
   *
   * @param {ValidationOptions} [options] - Additional options for the validation
   * @param {string} options.context - The context for the validation. This allows you to only run a subset of validations for a particular context.
   * @returns {boolean} Returns `true` if the object is valid.
   */
  valid = (options?: ValidationOptions): this is Validated & this => {
    this.errors = new ValidationErrors();
    this.validation(options);
    return Object.keys(this.errors.entries()).length === 0;
  };

  /**
   * Validate a field.
   *
   * @param {string} attribute - The name of the object attribute to validate.
   * @param {Validator} validator - The validation function to apply to @param attribute.
   * @param {string} [message] - A message override to apply when validation fails.
   */
  validates = <Attribute extends keyof this>(
    attribute: Attribute,
    validator: (val: this[typeof attribute]) => string | undefined,
    message?: string,
  ) => {
    const validate = !this.adapter ? validator : this.adapter(validator);
    const error = validate(this[attribute]);
    if (error) {
      this.errors.add(attribute as string, message ?? error);
    }
  };
}

interface R<T, Validated> {
  new (obj: T): T & ValidationObject<Validated>;
}

export function validationObject<T, Validated = Record<string, never>>(
  validator: (
    obj: InstanceType<R<T, Validated>>,
    options?: ValidationOptions,
  ) => void,
): R<T, Validated> {
  return class extends ValidationObject<Validated> {
    constructor(obj: T) {
      super();
      Object.assign(this, obj);
    }

    validation(opts: ValidationOptions) {
      validator(this as unknown as InstanceType<R<T, Validated>>, opts);
    }
  } as R<T, Validated>;
}
