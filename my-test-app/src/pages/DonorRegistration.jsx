// src/pages/DonorRegistration.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const DonorSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
  organization: Yup.string().required('Required'),
  donationType: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
  message: Yup.string()
});

const DonorRegistration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Donor Registration</h2>
        </div>
        <Formik
          initialValues={{
            name: '',
            email: '',
            phone: '',
            organization: '',
            donationType: '',
            country: '',
            message: ''
          }}
          validationSchema={DonorSchema}
          onSubmit={(values) => {
            console.log(values);
            navigate('/dashboard');
          }}
        >
          {({ errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-sm">{errors.name}</div>
                  )}
                </div>

                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </div>

                <div>
                  <Field
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.phone && touched.phone && (
                    <div className="text-red-500 text-sm">{errors.phone}</div>
                  )}
                </div>

                <div>
                  <Field
                    name="organization"
                    type="text"
                    placeholder="Organization Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.organization && touched.organization && (
                    <div className="text-red-500 text-sm">{errors.organization}</div>
                  )}
                </div>

                <div>
                  <Field
                    as="select"
                    name="donationType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Donation Type</option>
                    <option value="one-time">One-time Donation</option>
                    <option value="monthly">Monthly Donation</option>
                    <option value="annual">Annual Donation</option>
                    <option value="equipment">Equipment Donation</option>
                  </Field>
                  {errors.donationType && touched.donationType && (
                    <div className="text-red-500 text-sm">{errors.donationType}</div>
                  )}
                </div>

                <div>
                  <Field
                    name="country"
                    type="text"
                    placeholder="Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.country && touched.country && (
                    <div className="text-red-500 text-sm">{errors.country}</div>
                  )}
                </div>

                <div>
                  <Field
                    as="textarea"
                    name="message"
                    placeholder="Additional Message (Optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                  />
                  {errors.message && touched.message && (
                    <div className="text-red-500 text-sm">{errors.message}</div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                Register as Donor
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DonorRegistration;