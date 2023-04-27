import { useState } from "react";

const UwuWelcome = () => (
  <div
    className="w-full h-full flex items-center justify-center  terminal-background"
    style={{
      // backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='10' fill='%237368D6'/%3E%3C/svg%3E\")",
      // backgroundSize: "40px 40px",
    }}
  >
    {/* <div className="bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-700 min-h-screen text-white p-8 terminal-background">  */}
    <div className="">
      <div className="container mx-auto max-w-4xl py-8 px-6 bg-purple-900 bg-opacity-70 rounded-xl shadow-lg text-lg terminal-background  bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-700">
        <PixelArtText className="mb-4">
          Hewwo, and wewcome to uwu-owo.io! 💻✨
        </PixelArtText>
        <p className="mb-4">
          Dis is da pwace whewe I, Non-chan, shawe aww my supew cwool and
          adowable softwawe pwojects! 🌟🦄🌈 Hewe, I combine my passion fow
          coding with da cutest, most uwu-speak evew! ✨🐾
        </p>
        <p className="mb-4">
          On this fluffy-wuffy website, yuw'ww find a cowwlection of pwojects
          dat awe both paw-some and heawt-warming, fuww of technicaw cwevewness
          and uwu magic! 🌟🌸💖
        </p>
        <p className="mb-4">
          As yuw expwowe my uwu-owo wondewland, yuw'll discovew:
          <ul className="list-disc list-inside ml-4">
            <li className="mb-2">
              Da most paw-dowable apps, games, and softwawe toows 🎮🐾💻
            </li>
            <li className="mb-2">
              A bwoad wange of techno-paws: Fwont-end, back-end, AI, and mowe!
              🤖🐱
            </li>
            <li className="mb-2">
              Supew cwooty tutoowiaws fow aspiring uwu-coders 👩‍💻🌟
            </li>
          </ul>
        </p>
        <p className="mb-4">
          So, put on youw coding socks and hop in fow a wowld of uwu-owo
          goodness! 🌈✨
        </p>
        <p>
          We'we so happy to have yuw hewe! Enjwoy youw stay, and don't fowget to
          shawe youw thoughts and uwu-suggestions in da comment section bewow!
          🌸💖
        </p>
        <p className="mt-6 text-2xl font-bold">UwU 🦄🌟</p>
      </div>
      <UwuForm />
    </div>
  </div>
);

const UwuForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Submit form data here
    console.log(formData);
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="container mx-auto max-w-md p-6 bg-purple-900 bg-opacity-70 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">
        Shawe yuw thoughts and uwu-suggestions! 🌟💌
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="name">
            Name (OwO)
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-purple-800 text-white rounded"
            placeholder="Yuw name hewe"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="email">
            Email (UwU)
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-purple-800 text-white rounded"
            placeholder="Yuw email hewe"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="message">
            Message (≧◡≦)
          </label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-purple-800 text-white rounded h-32"
            placeholder="Yuw message hewe"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-indigo-800 hover:bg-indigo-700 text-white rounded"
        >
          Send UwU-suggestion 🌈✨
        </button>
      </form>
    </div>
  );
};

import React from "react";
import { twMerge } from "tailwind-merge";

interface PixelArtTextProps {
  className?: string;
  children?: React.ReactNode;
}

export const PixelArtText: React.FC<PixelArtTextProps> = ({
  className,
  children,
}) => {
  return (
    <p className={twMerge("pixel-art-text css-typing", className)}>{children}</p>
  );
};

export default UwuWelcome;
