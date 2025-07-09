import {
  memo,
  useCallback,
  useImperativeHandle,
} from 'react'
import type {
  AnyFieldApi,
} from '@tanstack/react-form'
import { useForm } from '@tanstack/react-form'
import type {
  FormRef,
  FormSchema,
} from '@/app/components/base/form/types'
import {
  BaseField,
} from '.'
import type {
  BaseFieldProps,
} from '.'
import cn from '@/utils/classnames'

export type BaseFormProps = {
  formSchemas?: FormSchema[]
  defaultValues?: Record<string, any>
  formClassName?: string
  ref?: FormRef
  disabled?: boolean
} & Pick<BaseFieldProps, 'fieldClassName' | 'labelClassName' | 'inputContainerClassName' | 'inputClassName'>

const BaseForm = ({
  formSchemas,
  defaultValues,
  formClassName,
  fieldClassName,
  labelClassName,
  inputContainerClassName,
  inputClassName,
  ref,
  disabled,
}: BaseFormProps) => {
  const form = useForm({
    defaultValues,
  })

  useImperativeHandle(ref, () => {
    return {
      getForm() {
        return form
      },
    }
  }, [form])

  const renderField = useCallback((field: AnyFieldApi) => {
    const formSchema = formSchemas?.find(schema => schema.name === field.name)

    if (formSchema) {
      return (
        <BaseField
          field={field}
          formSchema={formSchema}
          fieldClassName={fieldClassName}
          labelClassName={labelClassName}
          inputContainerClassName={inputContainerClassName}
          inputClassName={inputClassName}
          disabled={disabled}
        />
      )
    }

    return null
  }, [formSchemas, fieldClassName, labelClassName, inputContainerClassName, inputClassName, disabled])

  if (!formSchemas?.length)
    return null

  return (
    <form
      className={cn(formClassName)}
    >
      {
        formSchemas.map((formSchema) => {
          return (
            <form.Field
              key={formSchema.name}
              name={formSchema.name}
            >
              {renderField}
            </form.Field>
          )
        })
      }
    </form>
  )
}

export default memo(BaseForm)
