import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const StudentSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  courses: Yup.string().required("Please specify the courses you are interested in"),
  language: Yup.string().required("Preferred language is required"),
});

const StudentRegistration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-lg w-full px-8 py-10 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-extrabold text-gray-800 mb-6">
          Student Registration
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Fill in the details below to register as a student.
        </p>
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            courses: "",
            language: "",
          }}
          validationSchema={StudentSchema}
          onSubmit={(values) => {
            console.log("Form Submitted:", values);
            navigate("/dashboard");
          }}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Field
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name && touched.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && touched.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email && touched.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <Field
                  name="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone && touched.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && touched.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Courses Field */}
              <div>
                <label htmlFor="courses" className="block text-sm font-medium text-gray-700">
                  Interested Courses
                </label>
                <Field
                  name="courses"
                  type="text"
                  placeholder="e.g., Mathematics, Science"
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.courses && touched.courses ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.courses && touched.courses && (
                  <p className="mt-1 text-sm text-red-500">{errors.courses}</p>
                )}
              </div>

              {/* Language Field */}
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Preferred Language
                </label>
                <Field
                  name="language"
                  type="text"
                  placeholder="e.g., English, Spanish"
                  className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.language && touched.language ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.language && touched.language && (
                  <p className="mt-1 text-sm text-red-500">{errors.language}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Register
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default StudentRegistration;
