from transformers import pipeline

# EVENT_CLASSES = [
#     "Tech Professionals",
#     "Entrepreneurs",
#     "Product Managers and UX Designers",
#     "C-Suite Executives",
#     "Students and Aspiring Techies",
#     "Investors and Venture Capitalists",
#     "Tech Enthusiasts and Hobbyists",
#     "Academics and Researchers",
#     "Tech Media and Bloggers",
#     "Industry-Specific Professionals",
#     "Open Source Contributors",
#     "Gamers and Game Developers"
# ]

EVENT_CLASSES = [
    "Technology",
    "Computer Science",
    "Business",
    "Finance",
]


class TagsClassifier:
    def __init__(self):
        self.classifier = pipeline("zero-shot-classification",
                                   model="facebook/bart-large-mnli")

    def classify(self, tags):
        return [i['labels'][0] for i in self.classifier(tags, EVENT_CLASSES)]
