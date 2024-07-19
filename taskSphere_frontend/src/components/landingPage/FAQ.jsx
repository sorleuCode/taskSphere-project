import React, { useState } from "react";
import { FaCaretRight , FaCaretUp} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css"; 

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Tasksphere?",
      answer: "Tasksphere is a comprehensive task management tool designed to help you organize and track your tasks efficiently. It integrate video conferencing features to create a dynamic platform for collaboration.",
    },
    {
      question: "What are the benefits of using Tasksphere?",
      answer: "Tasksphere streamlines your workflow, increases productivity, and improves collaboration. With its dynamic project management features and video conferencing capabilities, Tasksphere makes it easy to manage your team and get things done.",
    },
    {
      question: "Can I customize Tasksphere to fit my needs?",
      answer: "Yes, Tasksphere is highly customizable, allowing you to tailor it to your specific workflow and preferences.",
    },
    {
      question: "Is Tasksphere secure?",
      answer: "Yes, Tasksphere is designed with security in mind. We use industry-standard encryption and follow best practices to ensure that your data is safe and secure."
    },
    {
      question: "How can I get started with Tasksphere?",
      answer: "Getting started with Tasksphere is easy. Simply sign up for an account and follow the onboarding process to set up your workspace.",
    },
    {
      question: "What kind of support does Tasksphere offer?",
      answer: "Tasksphere offers 24/7 support through various channels including email, chat, and phone support.",
    },
    {
      question: "Can I try Tasksphere before I buy it?",
      answer: "Yes, Tasksphere offers a free trial period so you can explore its features before making a purchase.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div name="faq" className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl  font-normal mb-4">Find answers to Frequently Asked Questions (FAQS)</h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b">
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
            >
              <span className="font-semibold">{faq.question}</span>
              {openIndex === index ? <FaCaretUp /> : <FaCaretRight />}
            </button>
            {openIndex === index && <div className="p-4">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;