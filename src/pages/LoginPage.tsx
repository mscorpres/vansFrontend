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
import { useState } from "react";
import { Settings } from "lucide-react";
import SettingDrawer from "@/components/ims-settings/SettingDrawer";

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
  const [imsSettingsOpen, setImsSettingsOpen] = useState(false);
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
          title: "Welcome to Vans IMS Portal",
          description: "Now you can start your work",
          className: "bg-green-600 text-white items-center",
        });
      }
    });
  }
  return (
    <div className="relative mx-auto grid w-[400px] gap-6 p-[20px] rounded-md bg-blue-50 shadow ">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="fixed right-4 top-4 z-[2000] h-11 w-11 border-slate-300 bg-white shadow-md text-slate-700 hover:bg-slate-50"
        onClick={() => setImsSettingsOpen(true)}
        aria-label="IMS Settings / server URL"
        title="IMS Settings — API & socket URL"
      >
        <Settings className="h-5 w-5" />
      </Button>
      <SettingDrawer open={imsSettingsOpen} onClose={() => setImsSettingsOpen(false)} />
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
                  <Input placeholder="Username" {...field} />
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
                  <Input placeholder="password" {...field} type="Password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={data.loading === "loading"} type="submit" className="w-full bg-cyan-700 hover:bg-cyan-600">
            {data.loading === "loading" ? (
              <>
                <ReloadIcon className="h-[20px] w-[20px] animate-spin mr-[5px]" />
                Wait...
              </>
            ) : (
              "Submit"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-300 text-slate-700"
            onClick={() => setImsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Server URL &amp; socket (IMS Settings)
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
