from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.messages import AIMessage, HumanMessage

load_dotenv()

# llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")

# prompt = ChatPromptTemplate.from_messages(
#     [
#         (
#             "system",
#             "you are a helpful assistant that guides the user about the website that we will integerate with you."
#         ),
#         MessagesPlaceholder("chat_history"),
#         ("human", "{user_input}"),
#     ]
# )

# chain = prompt | llm

# chat_history = ChatMessageHistory()

# flag = True
# while (flag):
#     query = input("How Can I Help You:")

#     chat_history.add_user_message(query)

#     try:
#         response = chain.invoke(
#             {
#                 "user_input": query,
#                 "chat_history": chat_history.messages,
#             }
#         )

#         main_response = response.content
#         chat_history.add_ai_message(main_response)

#         print(main_response)

#     except Exception as e:
#         print(f"Error invoking model: {e}")

#     finally:
#         answer = input("Do you want to continue? (yes/no): ")
#         if answer.lower() == "no":
#             flag = False


# chat_history.clear()


class WebsiteGuideChatbot:
    def __init__(self):
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    '''you are a helpful assistant that guides the user about the website that we will integerate with you. The website is a event management website. Look for tags such as $$home which determines the current web page.
Tags:
$$home-nouser:
    - there is a sign in button to sign in to the app using your google account.  
    - the user can scroll down to explore public events near the user.
$$event-det-nouser:
    - public user registration details..;
    - payment/enroll with Register Button
$$home-signedin:
    - there is Create event button which takes the signed in user to a dashboard with organisations.
    - scrolling down will show public events.
$$dashboard:
    - list of all organisations the user has created or is a member of.
    - clicking on a organisation takes the user to the organisation details page
$$org-det: (Organisation Details Page)
    - List of all events and members under the current organistaion.
    - user can create a new user clicking the new event button
    - Clicking on the an event takes the user to the event details button.
    - members can be created or deleted
$$event-det: (Event details page)
    - View event details and enrollment details.
'''
                ),
                MessagesPlaceholder("chat_history"),
                ("human", "{user_input}"),
            ]
        )
        self.chain = prompt | llm

    def respond(self, q, chat_history: ChatMessageHistory):

        chat_history.add_user_message(q)

        try:
            response = self.chain.invoke(
                {
                    "user_input": q,
                    "chat_history": chat_history.messages,
                }
            )

            main_response = response.content
            chat_history.add_ai_message(main_response)
            return chat_history.model_dump_json()
        except Exception as e:
            print(f"Error invoking model: {e}")

        return None


class MultiUserChatHistory:

    def __init__(self):
        self.chat_histories: dict[str, ChatMessageHistory] = {}

    def create(self, userId: str):
        if userId not in self.chat_histories:
            self.chat_histories[userId] = ChatMessageHistory()
        else:
            self.chat_histories[userId].clear()

    def get(self, userId: str):
        if userId not in self.chat_histories:
            self.create(userId)
        return self.chat_histories[userId]

    def remove(self, userId: str):
        if userId in self.chat_histories:
            del self.chat_histories[userId]
