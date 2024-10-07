import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const ForgotPassword = () => {
  return (
    <div className="mx-auto grid w-[400px] gap-6 p-[20px] rounded-md bg-blue-50 shadow ">
    <div className="grid gap-2">
      <h1 className="text-3xl font-bold text-slate-600"></h1>
      <p className="text-balance text-muted-foreground">
        Enter your email address associated with your account and we'll send you a link to reset password
      </p>
    </div>
    <div className="grid gap-4 mt-[30px]">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <Button type="submit" className="w-full shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500">
        Continue
      </Button>
    </div>
  </div>
  )
}

export default ForgotPassword
