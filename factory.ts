interface Factory {
  withSugar(): Factory & SugarFactory;
  withWhey(): Factory & WheyFactory;
  withProtein(): Factory & ProteinFactory;
}

interface SugarFactory extends Factory {
  getSugar(): number;
}

interface WheyFactory extends Factory {
  getWhey(): boolean;
}

interface ProteinFactory extends Factory {
  getProtein(): "A" | "B";
}

const getSugar = (): number => 0;
const getProtein = (): "A" | "B" => "A";
const getWhey = (): boolean => false;

const withSugar = (): Factory & SugarFactory => ({ ...factory, getSugar });
const withWhey = (): Factory & WheyFactory => ({ ...factory, getWhey })
const withProtein = (): Factory & ProteinFactory => ({ ...factory, getProtein })

const factory: Factory = {
  withSugar,
  withWhey,
  withProtein,
};

factory.withProtein().withSugar().getSugar(); //?

/**

class Factory {
  withSugar(): Factory & { getSugar(): number } {
    return new SugarFactory();
  }
  withWhey(): Factory & { getWhey(): boolean } {
    return new WheyFactory();
  }
  withProtein(): Factory & { getProtein(): "A" | "B" } {
    return new ProteinFactory();
  }
}

class SugarFactory extends Factory {
  getSugar(): number {
    return 0;
  }
}

class WheyFactory extends Factory {
  getWhey(): boolean {
    return false;
  }
}

class ProteinFactory extends Factory {
  getProtein(): "A" | "B" {
    return "A";
  }
}

new Factory().withWhey().withSugar(); //?

*/
