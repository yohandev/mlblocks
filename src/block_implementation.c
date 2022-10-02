# include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#include "../include/mnist_file.h"
#include "../include/neural_network.h"

// Convert a pixel value from 0-255 to 0 to 1
#define PIXEL_SCALE(x) (((float) (x)) / 255.0f)

// Random value between 0 and 1
#define RAND_FLOAT() (((float) rand()) / ((float) RAND_MAX))

/**
 * Initialise the weights and bias vectors with values between 0 and 1
 */
void initialize_weights(neural_network_t * network)
{
    int i, j;

    for (i = 0; i < MNIST_LABELS; i++) {
        network->b[i] = RAND_FLOAT();

        for (j = 0; j < MNIST_IMAGE_SIZE; j++) {
            network->W[i][j] = RAND_FLOAT();
        }
    }
}


void softmax(float * activations)
{
    int i;
    float sum, max;

    int length = 10;

    for (i = 1, max = activations[0]; i < length; i++) {
        if (activations[i] > max) {
            max = activations[i];
        }
    }

    for (i = 0, sum = 0; i < length; i++) {
        activations[i] = exp(activations[i] - max);
        sum += activations[i];
    }

    for (i = 0; i < length; i++) {
        activations[i] /= sum;
    }
}


void convolution(mnist_image_t * image, neural_network_t * network, float activations[MNIST_LABELS])
{
    int i, j;

    for (i = 0; i < MNIST_LABELS; i++) {
        activations[i] = network->b[i];

        for (j = 0; j < MNIST_IMAGE_SIZE; j++) {
            activations[i] += network->W[i][j] * PIXEL_SCALE(image->pixels[j]);
        }
    }
}


float calculate_gradient(mnist_image_t * image, neural_network_t * network, neural_network_gradient_t * gradient, uint8_t label)
{
    float activations[MNIST_LABELS];
    float b_grad, W_grad;
    int i, j;

    // First forward propagate through the network to calculate activations
    convolution(image, network, activations);
    softmax(activations);

    for (i = 0; i < MNIST_LABELS; i++) {
        // This is the gradient for a softmax bias input
        b_grad = (i == label) ? activations[i] - 1 : activations[i];

        for (j = 0; j < MNIST_IMAGE_SIZE; j++) {
            // The gradient for the neuron weight is the bias multiplied by the input weight
            W_grad = b_grad * PIXEL_SCALE(image->pixels[j]);

            // Update the weight gradient
            gradient->W_grad[i][j] += W_grad;
        }

        // Update the bias gradient
        gradient->b_grad[i] += b_grad;
    }

    // Cross entropy loss
    return 0.0f - log(activations[label]);
}

/**
 * Run one step of gradient descent and update the neural network.
 */
float backprop(mnist_dataset_t * dataset, neural_network_t * network, float learning_rate)
{
    neural_network_gradient_t gradient;
    float total_loss;
    int i, j;

    // Zero initialise gradient for weights and bias vector
    memset(&gradient, 0, sizeof(neural_network_gradient_t));

    // cross entropy loss
    for (i = 0, total_loss = 0; i < dataset->size; i++) {
        total_loss += calculate_gradient(&dataset->images[i], network, &gradient, dataset->labels[i]);
    }

    // Apply gradient descent to the network
    for (i = 0; i < MNIST_LABELS; i++) {
        network->b[i] -= learning_rate * gradient.b_grad[i] / ((float) dataset->size);

        for (j = 0; j < MNIST_IMAGE_SIZE; j++) {
            network->W[i][j] -= learning_rate * gradient.W_grad[i][j] / ((float) dataset->size);
        }
    }

    return total_loss;
}


int * maxpool(int * input, int inputSize, int poolSize){
    int * output = (int *) malloc(sizeof(int) * inputSize / poolSize);
    int i, j, max;
    for(i = 0; i < inputSize / poolSize; i++){
        max = input[i * poolSize];
        for(j = 1; j < poolSize; j++){
            if(input[i * poolSize + j] > max){
                max = input[i * poolSize + j];
            }
        }
        output[i] = max;
    }
    return output;
}

int * fullyConnected(int * input, int * weights, int inputSize, int outputSize){
    int * output = (int *) malloc(sizeof(int) * outputSize);
    int i, j;
    for(i = 0; i < outputSize; i++){
        output[i] = 0;
        for(j = 0; j < inputSize; j++){
            output[i] += input[j] * weights[i * inputSize + j];
        }
    }
    return output;
}


int * relu(int * input, int inputSize){
    int * output = (int *) malloc(sizeof(int) * inputSize);
    int i;
    for(i = 0; i < inputSize; i++){
        output[i] = input[i] > 0 ? input[i] : 0;
    }
    return output;
}

int * flatten(int * input, int inputSize){
    int * output = (int *) malloc(sizeof(int) * inputSize);
    int i;
    for(i = 0; i < inputSize; i++){
        output[i] = input[i];
    }
    return output;
}

int * reshape(int * input, int inputSize, int * shape, int shapeSize){
    int * output = (int *) malloc(sizeof(int) * inputSize);
    int i;
    for(i = 0; i < inputSize; i++){
        output[i] = input[i];
    }
    return output;
}

float negativeLoglikelihoodLoss(int * input, int * target, int inputSize){
    float loss = 0;
    int i;
    for(i = 0; i < inputSize; i++){
        loss += target[i] * log(input[i]);
    }
    return -loss;
}

float meanSquaredErrorLoss(int * input, int * target, int inputSize){
    float loss = 0;
    int i;
    for(i = 0; i < inputSize; i++){
        loss += (input[i] - target[i]) * (input[i] - target[i]);
    }
    return loss / inputSize;
}

