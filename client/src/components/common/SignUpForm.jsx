"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import userAction from "@/src/lib/action/user.action";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function SignUpForm({ onSwitchToSignIn }) {
  const { register, handleSubmit, setError } = useForm();
  const [loader, setLoader] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // To track if the checkbox is checked
  const router = useRouter();

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      router.push("/"); // Use your router if needed
    }
  }, []);

  const onSubmit = async (data) => {
    console.log(data);

    if (isChecked) {
      setLoader(true);
      userAction
        .registerUser(data)
        .then((resp) => {
          sessionStorage.setItem("user", JSON.stringify(resp.data.user));
          sessionStorage.setItem("jwt", JSON.stringify(resp.data.jwt));
          setLoader(false);
          setCookie("jwt", resp.data.jwt, { maxAge: 60 * 60 * 24 });
          router.push("/profile"); // Redirect after success if needed
        })
        .catch((e) => {
          console.log(e);
          setLoader(false);
          alert(e?.response?.data?.error?.message);
        });
    } else {
      alert("Agree to Terms and Conditions!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          {...register("username", { required: "Name is required" })}
          className="w-full px-4 py-3 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full px-4 py-3 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          className="w-full px-4 py-3 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Mobile Number</label>
        <input
          type="text"
          {...register("mobile_number", {
            required: "Mobile number is required",
          })}
          className="w-full px-4 py-3 border rounded-md"
        />
      </div>

      {/* Terms and Conditions Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          onChange={() => setIsChecked(!isChecked)}
          className="form-checkbox"
        />
        <label className="text-sm">Agree to Terms and Conditions</label>
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
          "Sign Up"
        )}
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
