class Factory {
  withSugar(): Factory & { getSugar(): number } {
    return null;
  }
  withWhey(): Factory & { getWhey(): boolean } {
    return null;
  }
  withProtein(): Factory & { getProtein(): "A" | "B" } {
    return null;
  }
}

type Constructor = new (...args: any[]) => {};

function withSugar<TBase extends Constructor>(Base: TBase) {
  return class SugarFactory extends Base {
    getSugar(): number {
      return 0;
    }
  };
}

function withWhey<TBase extends Constructor>(Base: TBase) {
  return class WheyFactory extends Base {
    getWhey(): boolean {
      return false;
    }
  };
}

function withProtein<TBase extends Constructor>(Base: TBase) {
  return class ProteinFactory extends Base {
    getProtein(): "A" | "B" {
      return "A";
    }
  };
}

const sugarWheyFactory = new (withSugar(withWhey(Factory)))();
sugarWheyFactory.getSugar(); //?
sugarWheyFactory.getWhey(); //?

const wheySugarFactory = new (withWhey(withSugar(Factory)))();
wheySugarFactory.getSugar(); //?
wheySugarFactory.getWhey(); //?

const proteinFactory = new (withProtein(Factory))();
proteinFactory.getProtein() //?
