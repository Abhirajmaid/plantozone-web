"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { SecondaryButton } from "@/src/components";
export default function ProductReviewsSection({
  reviewForm,
  reviewRating,
  onInputChange,
  onStarClick,
  onSubmit,
}) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(e);
      setShowReviewForm(false);
    } catch {
      /* validation errors handled in parent */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mb-12" id="product-reviews">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Customer Reviews
        </h2>
        {!showReviewForm && (
          <button
            type="button"
            onClick={() => setShowReviewForm(true)}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shrink-0"
          >
            Add review
          </button>
        )}
      </div>

      <div className="space-y-8">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold text-gray-800">4.9</div>
            <div>
              <div className="flex items-center space-x-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    icon="material-symbols:star"
                    className="w-5 h-5 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">Customer reviews</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Review List</h3>
          <div className="space-y-6">
            {[
              {
                initial: "P",
                name: "Priya Sharma",
                title: "Perfect for my Mumbai apartment!",
                body: "This plant is absolutely beautiful! Delivery was super fast and packaging was excellent.",
                time: "2 weeks ago",
                gradient: "from-orange-400 to-pink-500",
              },
              {
                initial: "A",
                name: "Arjun Patel",
                title: "Great quality, excellent service",
                body: "The plant arrived in perfect condition. Customer service was very helpful.",
                time: "1 month ago",
                gradient: "from-blue-400 to-purple-500",
              },
            ].map((r) => (
              <div key={r.name} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${r.gradient} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
                  >
                    {r.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-gray-800">{r.name}</h4>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={star}
                            icon="material-symbols:star"
                            className="w-4 h-4 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <h5 className="font-medium text-gray-700 mb-2">{r.title}</h5>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      {r.body}
                    </p>
                    <span className="text-xs text-gray-500">{r.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showReviewForm && (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add your review</h3>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">* Required fields</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) => onInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={reviewForm.email}
                    onChange={(e) => onInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating *
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => onStarClick(star)}
                      className="transition-colors"
                    >
                      <Icon
                        icon="material-symbols:star"
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? "text-yellow-400"
                            : "text-gray-300 hover:text-yellow-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => onInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Review *
                </label>
                <textarea
                  rows={4}
                  value={reviewForm.review}
                  onChange={(e) => onInputChange("review", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                  required
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <SecondaryButton
                  type="submit"
                  withArrow={false}
                  className="px-6 py-2 rounded-md"
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : "Submit Review"}
                </SecondaryButton>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
