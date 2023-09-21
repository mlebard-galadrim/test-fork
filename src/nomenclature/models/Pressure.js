import Enum from '../../common/models/Enum';

class Pressure extends Enum {
  static BP = 'BP';

  static MP = 'MP';

  static HP = 'HP';

  static values = [Pressure.BP, Pressure.MP, Pressure.HP];

  static valuesWeight = {
    [Pressure.BP]: 1,
    [Pressure.MP]: 2,
    [Pressure.HP]: 3,
  };

  static readables = {
    [Pressure.BP]: 'enum:pressure:bp',
    [Pressure.MP]: 'enum:pressure:mp',
    [Pressure.HP]: 'enum:pressure:hp',
  };

  static compare(a, b) {
    return Pressure.valuesWeight[a] - Pressure.valuesWeight[b];
  }
}

export default Pressure;
