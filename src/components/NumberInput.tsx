/*

    Componente extraido de la documentacion de ant D

    https://ant.design/components/input

*/

import React, { useState, useEffect } from 'react';
import { Input, Tooltip } from 'antd';

interface NumericInputProps {
  style: React.CSSProperties;
  value: string;
  onChange: (value: string) => void;
}

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const NumberInput = (props: NumericInputProps) => {
  const { value, onChange } = props;

  // cree este estado para hacer mas seguras las validaciones y el change
  const [ reValue, setReValue ] = useState(value);

  /*
  useEffect(() => {
    if(value !== undefined && value.length > 0) {
        onChange(value);
        setReValue(value);
    }
  }, []);
  */


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    
    //const reg = /^-?\d*(\.\d*)?$/;
    const reg = /^\d*\.?\d*$/; // cambie para que solo positivos

    if (reg.test(inputValue)/* || inputValue === '' || inputValue === '-'*/) {
        setReValue(inputValue);
        
        if (onChange) {
            onChange(reValue);
        }
    }
  };

  const handleBlur = () => {
    let valueTemp = reValue;
    
    if (value !== undefined && value.charAt(value.length - 1) === '.' /*|| value === '-'*/) {
      valueTemp = value.slice(0, -1);
    }
    
    const reg = /^\d*\.?\d*$/; // cambie para que solo positivosss

    if (reg.test(valueTemp)/* || inputValue === '' || inputValue === '-'*/) {
        let valt = valueTemp.replace(/0*(\d+)/, '$1');

        if (onChange) {
            onChange(valt);
        }

      }
  };

  const title = value ? (
    <span className="numeric-input-title">{value !== '-' ? formatNumber(Number(value)) : '-'}</span>
  ) : (
    'Ingrese medida'
  );

  return (
    <Tooltip trigger={['focus']} title={title} placement="topLeft" overlayClassName="numeric-input">
      <Input
        {...props}
        value={reValue}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={16}
      />
    </Tooltip>
  );
};

export default NumberInput;