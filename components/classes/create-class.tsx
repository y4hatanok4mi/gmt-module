"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { ComboBox } from "@/components/combo-box";
import FileUpload from "../file-upload";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Class name is required and minimum 2 characters",
  }),
  section: z.string().min(1, {
    message: "Section is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Image is required",
  })
});

const CreateClassForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      section: "",
      description: "",
      imageUrl: ""
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/classes", values);

      const classId = response.data.class?.id;

      if (!classId) {
        throw new Error("Class ID not returned by the API");
      }

      router.push(`/teacher/classes/${classId}/courses`);
      toast.success("New Class Created!");
    } catch (err) {
      console.log("Failed to create new class!", err);
      toast.error("Something went wrong!");
    }
  };


  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">
        Provide information for your class.
      </h1>
      <p className="text-sm mt-3">
        It is ok if you cannot think of a good name.
        You can change them later.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-10"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Math 101"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="section"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Name:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Rose"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Mathematics Class for Grade 7 Rose"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Image <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    endpoint="classImage"
                    page="Edit Course"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateClassForm;