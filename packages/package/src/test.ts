import {
  ValidationErrors,
  ValidationObject,
  validationObject,
} from "./index.js";

describe("ValidationErrors", () => {
  let subject: ValidationErrors;
  beforeEach(() => {
    subject = new ValidationErrors();
  });

  describe("#add", () => {
    it("adds errors", () => {
      subject.add("foo", "must be a string");

      expect(subject.entries()).toEqual({
        foo: ["must be a string"],
      });
    });

    it("aggregates errors with the same name", () => {
      subject.add("foo", "must be a string");
      subject.add("foo", "must not be undefined");

      expect(subject.entries()).toEqual({
        foo: ["must be a string", "must not be undefined"],
      });
    });

    it("seperates errors with different names", () => {
      subject.add("foo", "must be a string");
      subject.add("bar", "must not be undefined");

      expect(subject.entries()).toEqual({
        bar: ["must not be undefined"],
        foo: ["must be a string"],
      });
    });
  });

  describe("#entries", () => {
    it("returns the error entries", () => {
      subject.add("foo", "must be a string");

      expect(subject.entries()).toEqual({
        foo: ["must be a string"],
      });
    });
  });
});

describe("ValidationObject", () => {
  describe("subclass", () => {
    class Subclass extends ValidationObject {
      name: string;

      constructor(attrs: { name: string }) {
        super();
        this.name = attrs.name;
      }

      validation() {
        if (this.name.length < 10) {
          this.errors.add("name", "must be longer than 10 characters");
        }
      }
    }

    describe("when valid", () => {
      const subject = new Subclass({ name: "0123456789" });

      it("#valid", () => {
        expect(subject.valid()).toEqual(true);
      });

      it("#errors.entries", () => {
        expect(subject.errors.entries()).toEqual({});
      });
    });

    describe("when invalid", () => {
      const subject = new Subclass({ name: "foo" });

      it("#valid", () => {
        expect(subject.valid()).toEqual(false);
      });

      it("#errors.entries", () => {
        expect(subject.errors.entries()).toEqual({
          name: ["must be longer than 10 characters"],
        });
      });
    });
  });

  describe("validationObject shorthand", () => {
    interface User {
      name: string;
    }

    const User = validationObject<User>((obj) => {
      if (obj.name.length < 10) {
        obj.errors.add("name", "must be longer than 10 characters");
      }
    });

    describe("when valid", () => {
      const subject = new User({ name: "0123456789" });

      it("#valid", () => {
        expect(subject.valid()).toEqual(true);
      });

      it("#errors.entries", () => {
        expect(subject.errors.entries()).toEqual({});
      });
    });

    describe("when invalid", () => {
      const subject = new User({ name: "foo" });

      it("#valid", () => {
        expect(subject.valid()).toEqual(false);
      });

      it("#errors.entries", () => {
        expect(subject.errors.entries()).toEqual({
          name: ["must be longer than 10 characters"],
        });
      });
    });
  });

  describe("#validates", () => {
    describe("subclass", () => {
      class Subclass extends ValidationObject {
        name: string;

        constructor(attrs: { name: string }) {
          super();
          this.name = attrs.name;
        }

        validation() {
          this.validates("name", (attr) =>
            attr.length < 10 ? "must be longer than 10 characters" : undefined,
          );
        }
      }

      describe("when valid", () => {
        const subject = new Subclass({ name: "0123456789" });

        it("#valid", () => {
          expect(subject.valid()).toEqual(true);
        });

        it("#errors.entries", () => {
          expect(subject.errors.entries()).toEqual({});
        });

        it("can become invalid", () => {
          subject.name = "foo";
          expect(subject.valid()).toEqual(false);
        });
      });

      describe("when invalid", () => {
        const subject = new Subclass({ name: "foo" });

        it("#valid", () => {
          expect(subject.valid()).toEqual(false);
        });

        it("#errors.entries", () => {
          expect(subject.errors.entries()).toEqual({
            name: ["must be longer than 10 characters"],
          });
        });

        it("can become valid", () => {
          subject.name = "0123456789";
          expect(subject.valid()).toEqual(true);
        });
      });
    });

    describe("validationObject shorthand", () => {
      interface User {
        name: string;
      }

      const User = validationObject<User>((obj) => {
        obj.validates("name", (attr) =>
          attr.length < 10 ? "must be longer than 10 characters" : undefined,
        );
      });

      describe("when valid", () => {
        const subject = new User({ name: "0123456789" });

        it("#valid", () => {
          expect(subject.valid()).toEqual(true);
        });

        it("#errors.entries", () => {
          expect(subject.errors.entries()).toEqual({});
        });

        it("can become invalid", () => {
          subject.name = "foo";
          expect(subject.valid()).toEqual(false);
        });
      });

      describe("when invalid", () => {
        const subject = new User({ name: "foo" });

        it("#valid", () => {
          expect(subject.valid()).toEqual(false);
        });

        it("#errors.entries", () => {
          expect(subject.errors.entries()).toEqual({
            name: ["must be longer than 10 characters"],
          });
        });

        it("can become valid", () => {
          subject.name = "0123456789";
          expect(subject.valid()).toEqual(true);
        });
      });
    });
  });
});
