import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const InstitutionSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  type: Yup.string().required('Required'),
});

const InstitutionRegistration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Institution Registration</h2>
        </div>
        <Formik
          initialValues={{
            name: '',
            email: '',
            phone: '',
            country: '',
            city: '',
            type: '',
          }}
          validationSchema={InstitutionSchema}
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
                    placeholder="Institution Name"
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
                    name="city"
                    type="text"
                    placeholder="City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.city && touched.city && (
                    <div className="text-red-500 text-sm">{errors.city}</div>
                  )}
                </div>

                <div>
                  <Field
                    as="select"
                    name="type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Institution Type</option>
                    <option value="school">School</option>
                    <option value="university">University</option>
                    <option value="training-center">Training Center</option>
                  </Field>
                  {errors.type && touched.type && (
                    <div className="text-red-500 text-sm">{errors.type}</div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Register Institution
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default InstitutionRegistration;