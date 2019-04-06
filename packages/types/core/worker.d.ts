interface IGWorker {
    up(): Promise<void>;
    down(): Promise<void>;
}

export { IGWorker };