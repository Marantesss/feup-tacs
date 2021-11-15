class Factory {
    withSugar(): Factory & { getSugar(): number } { return null }
    withWhey(): Factory & { getWhey(): boolean } { return null }
    withProtein(): Factory { return null } //?
  }
  
  class SugarFactory extends Factory {
    getSugar(): number { return 0 }
  }
  
  class WheyFactory extends Factory {
    getWhey(): boolean { return false }
  }
  
  class ProteinFactory extends Factory {
    getProtein(): 'A' | 'B' { return 'A' }
  }
  
  new Factory().withWhey().getWhey() //?