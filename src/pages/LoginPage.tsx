import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUserAsync } from "@/features/auth/authSlice";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "react-router-dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";


const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});
const LoginPage: React.FC = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.auth);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    dispatch(loginUserAsync(data)).then((response: any) => {
      if (response.payload.status === 200) {
        toast({
          title: "Welcome to Spigen IMS Portal",
          description: "Now you can start your work",
          className: "bg-green-600 text-white items-center",
        });
      }
    });
  }
  return (
    <div className="mx-auto grid w-[400px] gap-6 p-[20px] rounded-md bg-blue-50 shadow ">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold text-slate-600">Login</h1>
        <p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
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
                <FormLabel className="flex items-center justify-between w-full">
                  Password{" "}
                  <Link to="/forgot-password" className="inline-block ml-auto text-sm underline">
                    Forgot your password?
                  </Link>
                </FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={data.loading === "loading" ? true : false} type="submit" className="w-full bg-cyan-700 hover:bg-cyan-600">
            {data.loading === "loading" ? (
              <>
                <ReloadIcon className="h-[20px] w-[20px] animate-spin mr-[5px]" />
                Wait...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
