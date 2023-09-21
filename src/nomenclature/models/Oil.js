class Oil {
  constructor() {
    // noop for realm
  }

  static create(uuid, designation, family, isoGrade, brand, nature) {
    const instance = new this();

    instance.uuid = uuid;
    instance.designation = designation;
    instance.family = family;
    instance.isoGrade = isoGrade;
    instance.brand = brand;
    instance.nature = nature;

    return instance;
  }
}

Oil.schema = {
  name: 'Oil',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'string',
    family: 'OilFamily',
    isoGrade: 'int',
    brand: 'OilBrand',
    nature: 'string',
  },
};

export default Oil;
