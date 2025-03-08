import React from 'react';
import tailwindcss from '@tailwindcss/vite'

const App = () => {
  return (
    <>
  <meta charSet="utf-8" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <title>Calendar Note Taking App</title>
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
    rel="stylesheet"
  />
  <header className="bg-white shadow-md">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-gray-800">Calendar Notes</div>
      <nav className="space-x-4">
        <a className="text-gray-600 hover:text-gray-800" href="#">
          Home
        </a>
        <a className="text-gray-600 hover:text-gray-800" href="#">
          Features
        </a>
        <a className="text-gray-600 hover:text-gray-800" href="#">
          Pricing
        </a>
        <a className="text-gray-600 hover:text-gray-800" href="#">
          Contact
        </a>
      </nav>
    </div>
  </header>
  <main className="container mx-auto px-6 py-16">
    <section className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Organize Your Life with Ease
      </h1>
      <p className="text-gray-600 mb-8">
        A simple and effective way to manage your calendar and take notes.
      </p>
      <a
        className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600"
        href="#"
      >
        Get Started
      </a>
    </section>
    <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col items-center">
        <img
          alt="Screenshot of the calendar feature showing a monthly view with events and notes"
          className="rounded-lg shadow-md mb-4"
          height={300}
          src="https://storage.googleapis.com/a1aa/image/IYPV6AcO2jvfyAho30JK_NcVocGP-I0QSYJQni2kuAM.jpg"
          width={400}
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Calendar View</h2>
        <p className="text-gray-600 text-center">
          Easily view and manage your events and notes in a monthly calendar
          format.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <img
          alt="Screenshot of the note-taking feature with a list of notes and a detailed view of a selected note"
          className="rounded-lg shadow-md mb-4"
          height={300}
          src="https://storage.googleapis.com/a1aa/image/Qlxi_g-x7xqT6IhR-S5O-dRSU-43NPaz-fmh4ZZJRpg.jpg"
          width={400}
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Note Taking</h2>
        <p className="text-gray-600 text-center">
          Take detailed notes and organize them by date, category, or priority.
        </p>
      </div>
    </section>
    <section className="mt-16 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <i className="fas fa-calendar-alt text-4xl text-blue-500 mb-4"></i>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Easy to Use</h3>
          <p className="text-gray-600 text-center">
            Our app is designed to be intuitive and user-friendly.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <i className="fas fa-sync-alt text-4xl text-blue-500 mb-4"></i>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Sync Across Devices
          </h3>
          <p className="text-gray-600 text-center">
            Access your calendar and notes from any device, anywhere.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <i className="fas fa-lock text-4xl text-blue-500 mb-4"></i>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Secure</h3>
          <p className="text-gray-600 text-center">
            Your data is encrypted and securely stored.
          </p>
        </div>
      </div>
    </section>
  </main>
  <footer className="bg-white shadow-md mt-16">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <p className="text-gray-600">
        © 2023 Calendar Notes. All rights reserved.
      </p>
      <div className="space-x-4">
        <a className="text-gray-600 hover:text-gray-800" href="#">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a className="text-gray-600 hover:text-gray-800" href="#">
          <i className="fab fa-twitter"></i>
        </a>
        <a className="text-gray-600 hover:text-gray-800" href="#">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
    </div>
  </footer>
</>

  );
};

export default App;