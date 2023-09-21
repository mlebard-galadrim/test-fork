class AbstractRepository {
  /**
   * @param {Realm}              realm
   * @param {Realm.ObjectSchema} schema
   */
  constructor(realm, schema) {
    this.realm = realm;
    this.schema = schema;
    this.primaryKey = schema.primaryKey;

    this.find = this.find.bind(this);
    this.save = this.save.bind(this);
  }

  /**
   * Returns all records in a table
   * Note : this method is meant to be private
   *
   * @return {Realm.Results|null}
   */
  getTable() {
    return this.realm.objects(this.schema.name);
  }

  /**
   * Returns all records in a table
   *
   * @return {Realm.Results|null}
   */
  findAll() {
    return this.getTable();
  }

  /**
   * @param {String} id
   *
   * @return {Realm.Object|null}
   */
  find(id) {
    const result = this.realm.objects(this.schema.name).filtered(`${this.primaryKey} == $0`, id);

    return result.length ? result[0] : null;
  }

  /**
   * @param {String[]} ids Primary keys
   *
   * @return {Object[]} All objects not matching the given list of primary keys
   */
  findAllNotIn(ids) {
    return this.filterNotIn(this.realm.objects(this.schema.name), this.primaryKey, ids);
  }

  /**
   * @see https://github.com/realm/realm-js/issues/450#issuecomment-220737797
   * => IN() operator isn't supported yet (NOT IN even less)
   *
   * @param {Realm.Results} list
   * @param {String}        field  Field name
   * @param {any[]}         values Values to filter
   *
   * @returns {Object[]}
   */
  filterNotIn(list, field, values) {
    if (values.length <= 0) {
      return list;
    }

    // We need to filter the list ourselves, even if it'll break lazy loading,
    // as trying to compute a fake "NOT IN" query ourselves using `Realm.Results.filtered`
    // may break with a query string way too long (but that's not the main issue,
    // as it specifically fails with some combinations of data, and works for other ones ¯\_(ツ)_/¯ )
    // on iOS release builds...
    return list.slice().filter(object => {
      return !values.includes(object[field]);
    });
  }

  /**
   * @param {Object|Function} object The object or factory returning the object to save
   *
   * @return {Realm.Object} The saved and managed object
   */
  save(object) {
    let entry = null;
    const execute = () => {
      if (object instanceof Function) {
        object = object();
      }

      entry = this.realm.create(this.schema.name, object, true);
    };

    // Auto-wrap in a transaction if not already inside one:
    if (!this.realm.isInTransaction) {
      this.realm.write(execute);
    } else {
      execute();
    }

    return entry;
  }

  /**
   * Delete the given object(s) from the table
   *
   * @param {Realm.Object | Realm.Object[] | Realm.List<any> | Realm.Results<any> | any} object
   */
  delete(object) {
    // Auto-wrap in a transaction if not already inside one:
    if (this.realm.isInTransaction) {
      this.realm.delete(object);
      return;
    }

    this.realm.write(() => this.realm.delete(object));
  }

  /**
   * Delete the given object matching the primary key
   */
  deleteById(id) {
    const elementToDelete = this.realm.objectForPrimaryKey(this.schema.name, id);

    if (elementToDelete) {
      this.delete(elementToDelete);
    }
  }

  /**
   * Delete all objects in the table
   */
  deleteAll() {
    // Auto-wrap in a transaction if not already inside one:
    if (this.realm.isInTransaction) {
      this.realm.delete(this.getTable());
      return;
    }

    this.realm.write(() => this.realm.delete(this.getTable()));
  }

  /**
   * @return {Realm.Results}
   */
  findUnsynced() {
    return this.getTable().filtered('synced == $0', false);
  }

  /**
   * Mark all items as synced
   */
  markAllAsSynced() {
    const items = Array.from(this.findUnsynced());

    this.realm.write(() => {
      items.forEach(item => (item.synced = true));
    });
  }
}

export default AbstractRepository;
