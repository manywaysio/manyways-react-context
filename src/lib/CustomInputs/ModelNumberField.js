import { useState } from 'react';
import {
  getTemplate,
  getUiOptions,
  orderProperties,

  TranslatableString,
  ADDITIONAL_PROPERTY_FLAG,
  PROPERTIES_KEY,
  REF_KEY,
  ANY_OF_KEY,
  ONE_OF_KEY,
} from '@rjsf/utils';
import Markdown from 'markdown-to-jsx';
import get from 'lodash/get';
import has from 'lodash/has';
import isObject from 'lodash/isObject';
import set from 'lodash/set';
import unset from 'lodash/unset';

const ObjectField = ({
  schema: rawSchema,
  uiSchema = {},
  formData,
  errorSchema,
  idSchema,
  name,
  required = false,
  disabled,
  readonly,
  hideError,
  idPrefix,
  idSeparator,
  onBlur,
  onFocus,
  registry,
  title,
  onChange,
    props
}) => {
  const [wasPropertyKeyModified, setWasPropertyKeyModified] = useState(false);

  const isRequired = (name) => {

    return Array.isArray(schema.required) && schema.required.indexOf(name) !== -1;
  };

  const onPropertyChange = (name, addedByAdditionalProperties = false) => {
    return (value, newErrorSchema, id) => {
      if (value === undefined && addedByAdditionalProperties) {
        value = '';
      }
      const newFormData = { ...formData, [name]: value };
      onChange(
        newFormData,
        errorSchema && {
          ...errorSchema,
          [name]: newErrorSchema,
        },
        id
      );
    };
  };

  const onDropPropertyClick = (key) => {
    return (event) => {
      event.preventDefault();
      const copiedFormData = { ...formData };
      unset(copiedFormData, key);
      onChange(copiedFormData);
    };
  };

  const getAvailableKey = (preferredKey, formData) => {
    const { uiSchema, registry } = props;
    const { duplicateKeySuffixSeparator = '-' } = getUiOptions(uiSchema, registry.globalUiOptions);

    let index = 0;
    let newKey = preferredKey;
    while (has(formData, newKey)) {
      newKey = `${preferredKey}${duplicateKeySuffixSeparator}${++index}`;
    }
    return newKey;
  };

  const onKeyChange = (oldValue) => {
    return (value, newErrorSchema) => {
      if (oldValue === value) {
        return;
      }
      const newFormData = {
        ...(formData),
      };
      const newKeys = { [oldValue]: value };
      const keyValues = Object.keys(newFormData).map((key) => {
        const newKey = newKeys[key] || key;
        return { [newKey]: newFormData[key] };
      });
      const renamedObj = Object.assign({}, ...keyValues);

      setWasPropertyKeyModified(true);

      onChange(
        renamedObj,
        errorSchema && {
          ...errorSchema,
          [value]: newErrorSchema,
        }
      );
    };
  };

  const getDefaultValue = (type) => {
    const {
      registry: { translateString },
    } = props;
    switch (type) {
      case 'array':
        return [];
      case 'boolean':
        return false;
      case 'null':
        return null;
      case 'number':
        return 0;
      case 'object':
        return {};
      case 'string':
      default:
        return translateString(TranslatableString.NewStringDefault);
    }
  };

  const handleAddClick = (schema) => () => {
    if (!schema.additionalProperties) {
      return;
    }
    const newFormData = { ...formData };

    let type;
    let defaultValue;
    if (isObject(schema.additionalProperties)) {
      type = schema.additionalProperties.type;
      defaultValue = schema.additionalProperties.default;
      let apSchema = schema.additionalProperties;
      if (REF_KEY in apSchema) {
        const { schemaUtils } = registry;
        apSchema = schemaUtils.retrieveSchema({ $ref: apSchema[REF_KEY] }, formData);
        type = apSchema.type;
        defaultValue = apSchema.default;
      }
      if (!type && (ANY_OF_KEY in apSchema || ONE_OF_KEY in apSchema)) {
        type = 'object';
      }
    }

    const newKey = getAvailableKey('newKey', newFormData);
    set(newFormData, newKey, defaultValue ?? getDefaultValue(type));

    onChange(newFormData);
  };

  const { fields, formContext, schemaUtils, translateString, globalUiOptions } = registry;
  const { SchemaField } = fields;
  const schema = schemaUtils.retrieveSchema(rawSchema, formData);
  const uiOptions = getUiOptions(uiSchema, globalUiOptions);
  const { properties: schemaProperties = {} } = schema;

  const templateTitle = uiOptions.title ?? schema.title ?? title ?? name;
  const description = uiOptions.description ?? schema.description;
  let orderedProperties;
  try {
    const properties = Object.keys(schemaProperties);
    orderedProperties = orderProperties(properties, uiOptions.order);
  } catch (err) {
    return (
      <div>
        <p className='config-error' style={{ color: 'red' }}>
          <Markdown options={{ disableParsingRawHTML: true }}>
            {translateString(TranslatableString.InvalidObjectField, [name || 'root', (err).message])}
          </Markdown>
        </p>
        <pre>{JSON.stringify(schema)}</pre>
      </div>
    );
  }

  const Template = getTemplate('ObjectFieldTemplate', registry, uiOptions);

  const templateProps = {
    title: uiOptions.label === false ? '' : templateTitle,
    description: uiOptions.label === false ? undefined : description,
    properties: orderedProperties.map((name) => {
      const addedByAdditionalProperties = has(schema, [PROPERTIES_KEY, name, ADDITIONAL_PROPERTY_FLAG]);
      const fieldUiSchema = addedByAdditionalProperties ? uiSchema.additionalProperties : uiSchema[name];
      const hidden = getUiOptions(fieldUiSchema).widget === 'hidden';
      const fieldIdSchema = get(idSchema, [name], {});

      return {
        content: (
          <SchemaField
            key={name}
            name={name}
            required={isRequired(name)}
            schema={get(schema, [PROPERTIES_KEY, name], {})}
            uiSchema={fieldUiSchema}
            errorSchema={get(errorSchema, name)}
            idSchema={fieldIdSchema}
            idPrefix={idPrefix}
            idSeparator={idSeparator}
            formData={get(formData, name)}
            formContext={formContext}
            wasPropertyKeyModified={wasPropertyKeyModified}
            onKeyChange={onKeyChange(name)}
            onChange={onPropertyChange(name, addedByAdditionalProperties)}
            onBlur={onBlur}
            onFocus={onFocus}
            registry={registry}
            disabled={disabled}
            readonly={readonly}
            hideError={hideError}
            onDropPropertyClick={onDropPropertyClick}
          />
        ),
        name,
        readonly,
        disabled,
        required,
        hidden,
      };
    }),
    readonly,
    disabled,
    required,
    idSchema,
    uiSchema,
    errorSchema,
    schema,
    formData,
    formContext,
    registry,
  };

  return <Template {...templateProps} onAddClick={handleAddClick} />;
};

export default ObjectField;
