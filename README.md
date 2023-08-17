# f r i z e

A free and open-source dashboard for users of Rize (a time tracker that logs your computer usage).

![frize](<https://ik.imagekit.io/zwcfsadeijm/screenshot-rocks%20(1)_z_xdRrsGK.png?updatedAt=1692225112367>)

Frize transforms your data into beautiful graphs and charts to help you visualise and gain insights into your productivity. Additionally, it also lets you search through your data and have a conversation with it using natural language powered by GPT.

## Tech Stack

- Next.js
- Tailwind CSS
- Tremor UI
- Supabase
- OpenAI
- Vercel

## How to set up and run the project?

### Prerequisites

- **Node.js:** Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**
  ```bash
  npm install npm@latest -g
  ```
- **Supabase:** Create a project on [supabase.com](https://supabase.com/) and get your `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.
- **OpenAI:** Create an account on [openai.com](https://openai.com/) and get your `OPENAI_KEY`.
- **Data collection:** Setup and the run the companion [python script](https://github.com/rittikbasu/rize_reader) for collecting data from your email.

### Installation

1. Clone this repository on your local machine
   ```bash
   git clone https://github.com/rittikbasu/frize.git
   ```
2. Navigate to the project directory
   ```bash
   cd frize
   ```
3. Install the dependencies
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add the following keys:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   SUPABASE_SERVICE_KEY=YOUR_SUPABASE_SERVICE_KEY
   OPENAI_KEY=YOUR_OPENAI_KEY
   STATIC_IP=YOUR_STATIC_IP
   ```

   Note: Using a static IP lets you restrict access to certain parts of the website for visitors. If you don't have one no worries just set it to 0.

5. Run the development server
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
