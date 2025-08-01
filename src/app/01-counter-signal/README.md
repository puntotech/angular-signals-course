# Counter with Writable and Readonly Signals

This example demonstrates how to use writable and readonly signals in Angular to manage state and trigger change detection.

## Key Features

- `WritableSignal`: A signal that can be updated directly.
- `ReadonlySignal`: A signal that provides read-only access to the state.

## How It Works

- The `count1` signal is writable and can be updated using the `update` method.
- The `count2` signal is a readonly version of `count1`, ensuring immutability for consumers.

## Code Highlights

- Increment the counter using the `increment` method.
- Observe how signals automatically trigger change detection.

## Path

`src/app/01-counter-signal`
