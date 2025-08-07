const feedbackMessages = [
  "Don't be discouraged—everyone starts somewhere! Review the basics and give it another shot. You're making progress just by trying.",
  "You're on the right track! A bit more review and practice will help boost your confidence and results. Keep going!",
  "Nice effort! You've picked up some key ideas. With a little more practice, you'll get even stronger.",
  "Great work! You have a good understanding of the material. A little fine-tuning and you'll master it.",
  "Outstanding! You've really shown your mastery of these concepts. Congratulations on your excellent work!"
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
    <div>
      {getFeedback(percent)}
    </div>
  );
}
