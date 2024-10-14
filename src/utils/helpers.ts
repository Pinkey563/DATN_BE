export class HelperUtils {
  static existByName = async (entity: any, name: string, field = 'name') => {
    return await entity.existsBy({ [field]: name });
  };
}
