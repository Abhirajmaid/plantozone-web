import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/button";

export default function SignUpForm({ onSwitchToSignIn }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Sign Up Data:", data);
    // Add Axios call or API request here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          {...register("name", { required: true })}
          className="w-full px-4 py-3 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          {...register("email", { required: true })}
          className="w-full px-4 py-3 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          {...register("password", { required: true })}
          className="w-full px-4 py-3 border rounded-md"
        />
      </div>
      <Button type="submit" className="w-full bg-primary">
        Sign Up
      </Button>
      <p className="text-center text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-[#0b9c09]"
        >
          Sign In
        </button>
      </p>
    </form>
  );
}
