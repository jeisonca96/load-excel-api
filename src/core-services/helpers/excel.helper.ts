import * as Joi from '@hapi/joi';

export function mapExcelData(data) {
  return data.slice(1).map((row) => {
    const obj: any = {};
    data[0].forEach((key, colIndex) => {
      if (key) {
        obj[key] = row[colIndex];
      }
    });
    return obj;
  });
}

export function getSchema(data) {
  const properties = Object.keys(data).reduce((acc, key) => {
    acc[key] = typeof data[key] === 'number' ? Joi.number() : Joi.string();
    return acc;
  }, {});

  return Joi.array()
    .options({ abortEarly: false })
    .items(Joi.object(properties));
}

export function validateErrorData(data) {
  const schema = getSchema(data[0]);
  const { error } = schema.validate(data);
  if (error) {
    return error.details.map((e) => {
      const property = e.path[e.path.length - 1];
      return {
        message: `Property ${property} must be a ${e.type.split('.')[0]}`,
        value: e.context.value,
        row: e.path[0] + 2,
        column: e.context.key,
      };
    });
  }
}
