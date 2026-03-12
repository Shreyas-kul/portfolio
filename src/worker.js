import { pipeline, env } from '@xenova/transformers';

// Tell transformers.js to avoid local file system reading in browser
env.allowLocalModels = false;
env.useBrowserCache = true;

class MLPipeline {
    static task = 'text-classification';
    static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    // Retrieve the pipeline. Initialize it if it's the first time running.
    let classifier = await MLPipeline.getInstance(x => {
        self.postMessage({ status: 'progress', ...x });
    });

    let output = await classifier(event.data.text);

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: output,
        text: event.data.text,
    });
});
