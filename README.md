# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Using Your Own Job Data

If you have your own list of jobs in JSON format, you can use it with this application:

1.  **Prepare your JSON file**: Ensure your JSON file has a root object with a key named `"jobs"`, and this key should contain an array of job objects. Each job object should conform to the structure defined in `src/types/job.ts`.
    A sample file is provided at `public/data/jobs.json`. You can use this as a template.

2.  **Place your JSON file**:
    *   Create a directory `public/data` in your project if it doesn't already exist.
    *   Place your JSON file (e.g., `my_jobs.json`) inside the `public/data` directory. For example, `public/data/my_jobs.json`.

3.  **Use it in the app**:
    *   Run the application.
    *   On the homepage, in the "Job List JSON URL" input field, enter the path to your file, prefixed with a `/`. For example, if your file is `public/data/my_jobs.json`, you would enter `/data/my_jobs.json`.
    *   Click "Fetch Jobs".

The application will then load and display the jobs from your local JSON file.
