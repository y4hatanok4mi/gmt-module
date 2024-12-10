"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";
import ErrorMessage from "@/components/error-message";

import { format } from "date-fns"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/schema";
import { handleSignUp } from "@/app/actions/authActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Calendar as CalendarIcon
  } from "lucide-react"
import { Calendar } from "@/components/ui/calendar";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordStrengthMeter from "@/components/password-meter";
import SignUpSuccessModal from "@/components/email-verification-modal";

export default function SignUp() {
    const [globalError, setGlobalError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fname: "",
            lname:"",
            email: "",
            password: "",
            confirmPassword: "",
            id_no: "",
        },
    });

    const { trigger, control, handleSubmit } = form;

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {

      try {
        const result: ServerActionResponse = await handleSignUp(values);
        if (result.success) {
            console.log("Account created successfully!");
            setIsModalOpen(true);

            setTimeout(() => {
              router.push("auth/signin");
            }, 2000);
        } else {
            setGlobalError(result.message);
        }
        } catch (error) {
            setGlobalError("An unexpected error occurred. Please try again.");
      }
    };

    const validateConfirmPassword = async () => {
      await trigger("confirmPassword");
    };

    return (
        <div className="grow flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-gray-800">
                    Geome<span className="text-green-600">Triks</span>
                    <p className="text-2xl text-gray-700">Create Account</p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-3"
                        >
                            <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input 
                                placeholder="geometriks@example.com"
                                
                                type="email"
                                {...field} />
                            </FormControl>
                            
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                            <PasswordStrengthMeter password={field.value || ""} />
                            </FormItem>
                        )}
                        />

                              <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="Confirm your password"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    validateConfirmPassword();
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                              />

                        
                        <div className="grid grid-cols-12 gap-4">
                        
                          <div className="col-span-6">
                            <FormField
                            control={form.control}
                            name="fname"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input 
                                    placeholder="John"
                                    
                                    type="text"
                                    {...field} />
                                </FormControl>
                                
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                          </div>
                        
                          <div className="col-span-6">
                            <FormField
                            control={form.control}
                            name="lname"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input 
                                    placeholder="Doe"
                                    
                                    type="text"
                                    {...field} />
                                </FormControl>
                                
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                                
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                    <FormField
                    control={form.control}
                    name="bday"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => field.onChange(date)}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                    
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                        <FormField
                          control={form.control}
                          name="school"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>School</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select school" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="SNHS">SNHS</SelectItem>
                                  <SelectItem value="BNHS">BNHS</SelectItem>
                                  <SelectItem value="MNCHS">MNCHS</SelectItem>
                                  <SelectItem value="BSNHS">BSNHS</SelectItem>
                                  <SelectItem value="PBNHS">PBNHS</SelectItem>
                                </SelectContent>
                              </Select>
                                
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role:</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="student">Student</SelectItem>
                                  <SelectItem value="teacher">Teacher</SelectItem>
                                </SelectContent>
                              </Select>
                                
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                        control={form.control}
                        name="id_no"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>ID Number</FormLabel>
                            <FormControl>
                                <Input 
                                placeholder="21B1569"
                                
                                type="text"
                                {...field} />
                            </FormControl>
                            
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                          <div className="flex flex-col">
                            {globalError && <ErrorMessage error={globalError} />}
                            <LoadingButton
                                pending={form.formState.isSubmitting}
                            >
                                Sign Up
                            </LoadingButton>
                          </div>
                        </form>
                    </Form>
                    <div className="flex justify-center items-center mt-2">
                    <p className='text-sm flex justify-center'>
                        Already have an account? {" "}
                        <Link href={"/auth/signin"} className='text-green-400 hover:underline'>
                            Sign in
                        </Link> 
                    </p>
                </div>
                </CardContent>
            </Card>
            <SignUpSuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
