import { get } from 'k2/app/container';
import Fluid from 'k2/app/modules/nomenclature/models/Fluid';
import FluidFamily from 'k2/app/modules/nomenclature/models/FluidFamily';
import Oil from 'k2/app/modules/nomenclature/models/Oil';
import OilFamily from 'k2/app/modules/nomenclature/models/OilFamily';
import InstallationTechnology from 'k2/app/modules/nomenclature/models/InstallationTechnology';
import InstallationApplication from 'k2/app/modules/nomenclature/models/InstallationApplication';
import InstallationType from 'k2/app/modules/nomenclature/models/InstallationType';
import Competitor from 'k2/app/modules/nomenclature/models/Competitor';
import ControlPeriodicity from 'k2/app/modules/nomenclature/models/ControlPeriodicity';
import ComponentBrand from 'k2/app/modules/nomenclature/models/ComponentBrand';
import ComponentNature from 'k2/app/modules/nomenclature/models/ComponentNature';
import ComponentNatureType from 'k2/app/modules/nomenclature/models/ComponentNatureType';
import ComponentNatureClassification from 'k2/app/modules/nomenclature/models/ComponentNatureClassification';
import OilBrand from 'k2/app/modules/nomenclature/models/OilBrand';
import Article from 'k2/app/modules/nomenclature/models/Article';
import ArticleInterventionUnavailability from 'k2/app/modules/nomenclature/models/ArticleInterventionUnavailability';
import Translation from 'k2/app/modules/nomenclature/models/Translation';
import AbstractImporter from 'k2/app/modules/common/api/importers/AbstractImporter';
import AnalysisType from 'k2/app/modules/nomenclature/models/AnalysisType';
import Coolant from '../../../nomenclature/models/Coolant';

class NomenclatureImporter extends AbstractImporter {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm);

    this.articleRepository = get('article_repository');
    this.fluidRepository = get('fluid_repository');
    this.fluidFamilyRepository = get('fluid_family_repository');
    this.oilFamilyRepository = get('oil_family_repository');
    this.oilBrandRepository = get('oil_brand_repository');
    this.componentNatureRepository = get('component_nature_repository');
    this.competitorRepository = get('competitor_repository');

    this.load = this.load.bind(this);
    this.loadFluid = this.loadFluid.bind(this);
    this.loadOil = this.loadOil.bind(this);
    this.loadBasicNomenclature = this.loadBasicNomenclature.bind(this);
    this.loadComponentNatureType = this.loadComponentNatureType.bind(this);
    this.loadComponentNatureClassification = this.loadComponentNatureClassification.bind(this);
    this.loadControlPeriodicity = this.loadControlPeriodicity.bind(this);
    this.loadArticle = this.loadArticle.bind(this);
    this.loadArticleIfEmpty = this.loadArticleIfEmpty.bind(this);
    this.loadAnalysisType = this.loadAnalysisType.bind(this);
  }

  /**
   * Load nomenclature from API into the database
   *
   * @param {Array} data
   */
  load(data) {
    console.info('Loading nomenclature...');
    this.realm.write(() => {
      // Removing some objects carefully to prevent dropping containers foreign key on partial sync:
      this.removeStaleObjects(this.fluidRepository, 'uuid', data.fluids);
      this.removeStaleObjects(this.articleRepository, 'uuid', data.articles);
      this.removeStaleObjects(this.competitorRepository, 'uuid', data.competitors);

      // Remove all unavailabilities as only articles references it and will re-create them:
      this.realm.delete(this.realm.objects(ArticleInterventionUnavailability.schema.name));
      // Drop nomenclature translations (otherwise those are duplicated on each sync as they don't have any primary key)
      this.realm.delete(this.realm.objects(Translation.schema.name));

      // All other nomenclatures are simply updated:
      data.fluidFamilies.forEach(object => this.loadBasicNomenclature(object, FluidFamily));
      data.oilFamilies.forEach(object => this.loadTranslatedNomenclature(object, OilFamily));
      data.fluids.forEach(this.loadFluid);
      data.oils.forEach(this.loadOil);
      data.installationTechnologies.forEach(object => this.loadTranslatedNomenclature(object, InstallationTechnology));
      data.installationApplications.forEach(object => this.loadTranslatedNomenclature(object, InstallationApplication));
      data.installationTypes.forEach(object => this.loadTranslatedNomenclature(object, InstallationType));
      data.competitors.forEach(object => this.loadBasicNomenclature(object, Competitor));
      data.componentBrands.forEach(object => this.loadBasicNomenclature(object, ComponentBrand));
      data.componentNatures.forEach(object => this.loadTranslatedNomenclature(object, ComponentNature));
      data.componentNatureTypes.forEach(this.loadComponentNatureType);
      data.componentNatureClassifications.forEach(this.loadComponentNatureClassification);
      data.controlPeriodicity.forEach(this.loadControlPeriodicity);
      data.oilBrands.forEach(object => this.loadBasicNomenclature(object, OilBrand));
      data.articles.forEach(this.loadArticle);
      data.articles.forEach(this.loadArticleIfEmpty);
      data.analysisTypes.forEach(this.loadAnalysisType);
      data.coolants.forEach(object => this.loadTranslatedNomenclature(object, Coolant));
    });
    console.info('Nomenclature loaded!');
  }

  /**
   * Load a fluid from API
   *
   * @param {Object} fluid
   */
  loadFluid(fluid) {
    const {
      uuid,
      designation,
      familyUuid,
      teqCo2Factor,
      usableInPrimaryCircuit,
      regenerated,
      wasteLoadPercent,
      wasteUniqId,
      wasteAdrDenomination,
    } = fluid;

    const fluidFamily = familyUuid ? this.fluidFamilyRepository.find(familyUuid) : null;

    const object = Fluid.create(
      uuid,
      designation,
      fluidFamily,
      teqCo2Factor,
      usableInPrimaryCircuit,
      regenerated,
      wasteLoadPercent,
      wasteUniqId,
      wasteAdrDenomination,
    );
    this.realm.create(Fluid.schema.name, object, true);
  }

  /**
   * Load an article from API
   *
   * @param {Object} article
   */
  loadArticle(article) {
    const {
      uuid,
      externalId,
      designation,
      fluidUuid,
      quantity,
      volume,
      pressure,
      unavailabilities,
      competitorUuid,
      belongsToMyCompany,
    } = article;

    const fluid = fluidUuid ? this.fluidRepository.find(fluidUuid) : null;
    const competitor = competitorUuid ? this.competitorRepository.find(competitorUuid) : null;
    const object = Article.create(
      uuid,
      externalId,
      designation,
      fluid,
      quantity,
      volume,
      pressure,
      belongsToMyCompany,
      competitor,
    );
    const instance = this.realm.create(Article.schema.name, object, true);

    unavailabilities.forEach(unavailability => {
      const { purpose, blocking } = unavailability;

      this.realm.create(
        ArticleInterventionUnavailability.schema.name,
        ArticleInterventionUnavailability.create(instance, purpose, blocking),
        true,
      );
    });
  }

  /**
   * Load article if empty association on loaded article
   *
   * @param {Object} data
   */
  loadArticleIfEmpty(data) {
    const { uuid, articleIfEmptyUuid } = data;

    if (!articleIfEmptyUuid) {
      return;
    }

    const article = this.articleRepository.find(uuid);
    article.articleIfEmpty = this.articleRepository.find(articleIfEmptyUuid);
  }

  /**
   * Load an oil from API
   *
   * @param {Object} oil
   */
  loadOil(oil) {
    const { uuid, designation, familyUuid, isoGrade, brandUuid, nature } = oil;

    const oilFamily = this.oilFamilyRepository.find(familyUuid);
    const oilBrand = this.oilBrandRepository.find(brandUuid);

    const object = Oil.create(uuid, designation, oilFamily, isoGrade, oilBrand, nature);
    this.realm.create(Oil.schema.name, object, true);
  }

  /**
   * Load basic nomenclature from API
   *
   * @param {Object} data
   * @param {Object} model
   */
  loadBasicNomenclature(data, model) {
    const { uuid, designation } = data;
    const object = model.create(uuid, designation);
    this.realm.create(model.schema.name, object, true);
  }

  /**
   * Load translated nomenclature from API
   *
   * @param {Object} data
   * @param {Object} model
   */
  loadTranslatedNomenclature(data, model) {
    const { uuid, designation, translations } = data;
    const object = model.create(uuid, this.parseTranslations('designation', designation, translations));
    this.realm.create(model.schema.name, object, true);
  }

  loadComponentNatureType(componentNatureType) {
    const { uuid, designation, natureUuid, translations } = componentNatureType;

    const nature = this.componentNatureRepository.find(natureUuid);

    const object = ComponentNatureType.create(
      uuid,
      this.parseTranslations('designation', designation, translations),
      nature,
    );
    this.realm.create(ComponentNatureType.schema.name, object, true);
  }

  loadComponentNatureClassification(componentNatureClassification) {
    const { uuid, designation, natureUuid, translations } = componentNatureClassification;

    const nature = this.componentNatureRepository.find(natureUuid);

    const object = ComponentNatureClassification.create(
      uuid,
      this.parseTranslations('designation', designation, translations),
      nature,
    );
    this.realm.create(ComponentNatureClassification.schema.name, object, true);
  }

  loadControlPeriodicity(controlPeriodicity) {
    const { uuid, fluidFamilyUuid, from, to, unit, withDetector, withoutDetector } = controlPeriodicity;

    const fluidFamily = this.fluidFamilyRepository.find(fluidFamilyUuid);

    const object = ControlPeriodicity.create(uuid, fluidFamily, from, to, unit, withDetector, withoutDetector);
    this.realm.create(ControlPeriodicity.schema.name, object, true);
  }

  loadAnalysisType(analysisType) {
    const { uuid, designation, explanation, translations, nature } = analysisType;

    const object = AnalysisType.fromApi(
      uuid,
      this.parseTranslations('designation', designation, translations),
      this.parseTranslations('explanation', explanation, translations),
      nature,
    );
    this.realm.create(AnalysisType.schema.name, object, true);
  }

  /**
   * Parse translation data from the API to construct a Translation object.
   *
   * @param  {String} property The property to translate
   * @param  {String} value    Default value
   * @param  {object} sources  Translation sources
   *
   * @return {Translation}
   */
  parseTranslations(property, value, sources) {
    const translation = Translation.create(value);

    Object.keys(sources).forEach(locale => translation.translate(locale, sources[locale][property]));

    return translation;
  }
}

export default NomenclatureImporter;
