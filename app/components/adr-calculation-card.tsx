"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/app/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Divider } from '@nextui-org/react';

interface FormValues {
  value1: string;
  value2: string;
  value3: string;
}

interface CalculationResult {
  value: number;
}

interface ADRCalculationCardProps {
  price: number;
}

const ADRCalculationCard: React.FC<ADRCalculationCardProps> = ({ price }) => {
  const [values, setValues] = useState<FormValues>({
    value1: '',
    value2: price.toString(),
    value3: ''
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setValues(prev => ({
      ...prev,
      value2: price.toString()
    }));
  }, [price]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setResult(null);
  };

  const calculateResult = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    const v1: number = parseFloat(values.value1);
    const v2: number = parseFloat(values.value2);
    const v3: number = parseFloat(values.value3);

    if (isNaN(v1) || isNaN(v2) || isNaN(v3)) {
      setError('Please enter valid numbers');
      return;
    }

    if (v1 - v3 === 0) {
      setError('Cannot divide by zero! (Value1 - Value3 cannot be zero)');
      return;
    }

    const calculation: number = (v1 - v2) / (v2 - v3);
    setResult({ value: calculation });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Risk Calculator</CardTitle>
        <Divider></Divider>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={calculateResult} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="value1">
            Price Target
            </label>
            <Input
              id="value1"
              type="number"
              name="value1"
              value={values.value1}
              onChange={handleChange}
              placeholder="Enter first value"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="value2">
              Price
            </label>
            <Input
              id="value2"
              type="number"
              name="value2"
              value={values.value2}
              onChange={handleChange}
              placeholder="Enter second value"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="value3">
              Stop Loss
            </label>
            <Input
              id="value3"
              type="number"
              name="value3"
              value={values.value3}
              onChange={handleChange}
              placeholder="Enter third value"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Calculate
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 w-full">
        <div className="w-full flex justify-between items-center border-t pt-4">
          <label className="text-sm font-medium">Result:</label>
          <span className="text-lg font-semibold">
            {result !== null ? result.value.toFixed(1) + "R" : '—'}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ADRCalculationCard;