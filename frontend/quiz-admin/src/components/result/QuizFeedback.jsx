const feedbackMessages = [
  "Needs significant improvement. Consider reviewing the foundational concepts and trying again.",
  "Below expectations. A bit more study and practice will help you achieve better results.",
  "Fair effort. You have grasped some concepts but there is room for improvement.",
  "Good performance. You have a solid understanding, but there are still areas to strengthen.",
  "Excellent work! You have demonstrated strong mastery of the material."
];

function getFeedback(percent) {
  if (percent >= 80) return feedbackMessages[4];
  if (percent >= 60) return feedbackMessages[3];
  if (percent >= 40) return feedbackMessages[2];
  if (percent >= 20) return feedbackMessages[1];
  return feedbackMessages[0];
}

export default function QuizFeedback({ percent }) {
  return (
    <div className="text-neutral-700 dark:text-neutral-200 text-md">
      {getFeedback(percent)}
    </div>
  );
}