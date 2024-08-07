import { type FieldError } from 'react-hook-form';

import CirclePlus from '@/assets/icons/circle-plus.svg?react';
import Minus from '@/assets/icons/minus.svg?react';
import Button from '@/ds-components/Button';
import IconButton from '@/ds-components/IconButton';
import TextInput, { type Props as TextInputProps } from '@/ds-components/TextInput';

import styles from './index.module.scss';

type FieldType = {
  key: string;
  value: string;
};

type ErrorType = {
  [K in keyof FieldType]?: FieldError | string | undefined;
};

// TextInput props getter
type InputFieldPropsGetter = {
  [K in keyof FieldType]: (index: number) => Omit<TextInputProps, 'ref'>;
};

type ErrorProps = {
  readonly error?: FieldError | string | undefined;
};
function Error({ error }: ErrorProps) {
  if (!error) {
    return null;
  }

  if (typeof error === 'string') {
    return <div className={styles.error}>{error}</div>;
  }

  return <div className={styles.error}>{error.message}</div>;
}

type Props = {
  readonly className?: string;
  readonly fields: Array<FieldType & { id: string }>; // Id is required to uniquely identify each field
  readonly errors?: Array<ErrorType | undefined>;
  readonly getInputFieldProps: InputFieldPropsGetter;
  readonly onRemove: (index: number) => void;
  readonly onAppend: (field: FieldType) => void;
};

/**
 * UI component for key-value input field.
 *
 * This component is used to add multiple key-value pairs.
 * For most of the cases, it is designed to be used along with react-hook-form.
 * All the input properties are registered with react-hook-form.
 * @param {Props} props - The props for the component.
 * @param {string} [props.className] - The class name for the container.
 * @param {FieldType} props.fields - The array of key-value pairs. @see {@link https://react-hook-form.com/docs/usefieldarray}
 * @param {ErrorType[]} [props.errors] - The array of errors for each field. Accepts both string and FieldError from RHF.
 * @param {Function} props.onRemove - The function to remove a field. @see {@link https://react-hook-form.com/docs/usefieldarray}
 * @param {Function} props.onAppend - The function to append a new field. @see {@link https://react-hook-form.com/docs/usefieldarray}
 * @param {InputFieldPropsGetter} getInputFieldProps - The function bundle to get the input field props for each field. e.g. Use React Hook Form's register method to register the input field.
 */
function KeyValueInputField({
  className,
  fields,
  errors,
  getInputFieldProps,
  onRemove,
  onAppend,
}: Props) {
  return (
    <div className={className}>
      {fields.map((field, index) => {
        return (
          // Use id as the element key if it exists (generated by react-hook-form useFieldArray method), otherwise use the key
          <div key={field.id} className={styles.field}>
            <div className={styles.input}>
              <TextInput
                className={styles.keyInput}
                placeholder="Key"
                error={Boolean(errors?.[index]?.key)}
                {...getInputFieldProps.key(index)}
              />
              <TextInput
                className={styles.valueInput}
                placeholder="Value"
                error={Boolean(errors?.[index]?.value)}
                {...getInputFieldProps.value(index)}
              />
              {fields.length > 1 && (
                <IconButton
                  onClick={() => {
                    onRemove(index);
                  }}
                >
                  <Minus />
                </IconButton>
              )}
            </div>
            <Error error={errors?.[index]?.key} />
            <Error error={errors?.[index]?.value} />
          </div>
        );
      })}
      <Button
        size="small"
        type="text"
        title="general.add_another"
        icon={<CirclePlus />}
        onClick={() => {
          onAppend({ key: '', value: '' });
        }}
      />
    </div>
  );
}

export default KeyValueInputField;
