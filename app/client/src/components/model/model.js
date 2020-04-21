import React, { useState, useEffect } from 'react'
import './model.css'
import {
  BrowserRouter as Router,
  useParams,
  Redirect
} from 'react-router-dom'
import Form from '../form'

const parseModel = (model) => {
  let textFields = model['SOURCE_FIELDS']
    .filter(field => !model['CATEGORIAL_LABELS'].includes(field))
    .map(field => ({
      type: 'text',
      name: field,
      label: field,
      regex: /^-?([0-9]+([.][0-9]*)?|[.][0-9]+)$/,
      required: true,
      maxLength: 5
    }))
  let radioFieldsObj = model['CATEGORIAL_LABELS'].reduce((acc, label) => {
    let fieldName = label.split('_')[0]
    let option = label.split('_')[1]
    let options = acc[fieldName] ? [...acc[fieldName], {name: option}] : [{name: option}]
    return {
      ...acc,
      [fieldName]: options
    }
  }, {})

  let radioFields = Object.keys(radioFieldsObj).map(f => (
    {
      type: 'radio',
      name: f,
      options: radioFieldsObj[f],
      initialValue: radioFieldsObj[f][0].name
    }
  ))
  return([...textFields, ...radioFields])
}

function Model({ models }) {
  const [results, setResults] = useState({})

  let { modelName } = useParams()
  let model = models.find(m => m['MODEL_NAME'] === modelName)
  useEffect(() => {
    console.log('Model rerender')
  }, [model])  
  if (!model) return <Redirect to='/models' />


  const handleResponse = (res) => {
    setResults(prev => ({...prev, [model.MODEL_NAME]: res}))
  }

  let form = model && <Form 
    fields={parseModel(model)}
    columns={2} 
    dataToSend={{MODEL_NAME: model.MODEL_NAME}}
    submitUrl='/api/predict' 
    formTitle={model.MODEL_TITLE || model.MODEL_NAME}
    onResponse={handleResponse}
  />

    
  
  return (
    <div className='model'>
      {form}
      {results[model.MODEL_NAME]}
    </div>
  )
}
Model.defaultProps = {
  
}
  
export default Model
