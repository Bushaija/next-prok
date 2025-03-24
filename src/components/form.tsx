import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form as ShadcnForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Form Component Interface
interface FormFieldType {
  name: string;
  title: string;
  type: "text" | "number" | "email" | "password" | "select" | "checkbox" | "tel" | "date" | "textarea";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface FormProps {
  fields: FormFieldType[];
  onSubmit: (data: Record<string, any>) => void;
}

export const Form: React.FC<FormProps> = ({ fields, onSubmit }) => {
  // Create a dynamic schema based on the fields
  const formSchema = z.object(
    fields.reduce((acc, field) => {
      let schema;
      if (field.required) {
        if (field.type === "email") {
          schema = z.string().email({ message: "Invalid email address" });
        } else if (field.type === "number") {
          schema = z.string().refine((val) => !isNaN(Number(val)), {
            message: "Must be a number",
          });
        } else if (field.type === "checkbox") {
          schema = z.boolean().default(false);
        } else {
          schema = z.string().min(1, { message: "This field is required" });
        }
      } else {
        if (field.type === "email") {
          schema = z.string().email({ message: "Invalid email address" }).optional();
        } else if (field.type === "number") {
          schema = z.string().refine((val) => !val || !isNaN(Number(val)), {
            message: "Must be a number",
          }).optional();
        } else if (field.type === "checkbox") {
          schema = z.boolean().default(false).optional();
        } else {
          schema = z.string().optional();
        }
      }
      return { ...acc, [field.name]: schema };
    }, {} as Record<string, z.ZodTypeAny>)
  );

  type FormSchema = z.infer<typeof formSchema>;

  // Initialize the form
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => {
      if (field.type === "checkbox") {
        return { ...acc, [field.name]: false };
      }
      return { ...acc, [field.name]: "" };
    }, {} as Record<string, any>),
  });

  // Handle form submission
  const handleSubmit = (values: FormSchema) => {
    onSubmit(values);
  };

  return (
    <ShadcnForm {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white shadow-md rounded-md">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof FormSchema}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.title}</FormLabel>
                <FormControl>
                  {field.type === "select" ? (
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder || "Select an option"} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      placeholder={field.placeholder}
                      {...formField}
                    />
                  ) : field.type === "checkbox" ? (
                    <Checkbox
                      checked={formField.value as boolean}
                      onCheckedChange={formField.onChange}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...formField}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-end">
        </div>
        <Button type="submit" className="flex bg-blue-600 hover:bg-blue-400 text-white mt-4">Submit</Button>
      </form>
    </ShadcnForm>
  );
};

export default Form;

