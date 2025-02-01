import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import userAction from "@/src/lib/action/user.action";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export default function SignInForm({ onSwitchToSignUp }) {
  const { register, handleSubmit } = useForm();
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      router.push("/profile");
    }
  }, []);

  const onSubmit = (data) => {
    setLoader(true);
    userAction
      .signIn(data)
      .then((resp) => {
        sessionStorage.setItem("user", JSON.stringify(resp.data.user));
        sessionStorage.setItem("jwt", JSON.stringify(resp.data.jwt));
        // success("You are Successfully Logged In");
        alert("You are Successfully Logged In");
        setLoader(false);
        setCookie("jwt", resp.data.jwt, { maxAge: 60 * 60 * 24 });
        router.push("/profile");
      })
      .catch((e) => {
        console.log(e);
        // warn("Server Error");
        // error(e?.response?.data?.error?.message);
        alert(e?.response?.data?.error?.message);
        setLoader(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
      <Button
        type="submit"
        className="w-full bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loader}
      >
        {loader ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          "Sign In"
        )}
      </Button>
      <p className="text-center text-sm">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-[#0b9c09]"
        >
          Create one
        </button>
      </p>
    </form>
  );
}
