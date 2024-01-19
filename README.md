# SIC Machine 2 Pass Assembler - React Application

## Overview

This React application serves as a 2 Pass Assembler for the Simplified Instructional Computer (SIC) machine. The assembler processes assembly code written in SIC assembly language and generates the corresponding machine code in two passes.

## Features

- **Two Pass Assembling:** The assembler performs a two-pass assembly process, handling symbol resolution, generating intermediate files, and producing the final object code.

- **Indexed Addressing:** Supports indexed addressing mode for instructions with the `,X` suffix.

- **User-Friendly Interface:** Provides a user-friendly interface for entering and processing assembly code.

- **Visual Output:** Displays the assembled code and generated object program in a visually accessible format.

## How It Looks Like
![image](https://github.com/Yousef-Diab/ReactJS_SIC_Two_Pass_Assembler/assets/37383782/4467a70d-9630-42fe-9296-4fdd4ef296e7)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Yousef-Diab/ReactJS_SIC_Two_Pass_Assembler.git
   ```

2. Navigate to the project directory:
   ```bash
    cd ReactJS_SIC_Two_Pass_Assembler
   ```

3. Install dependencies:
   ```bash
    npm install
   ```
4. Start the application:
   ```bash
    npm start
   ```

The application will be accessible at 'http://localhost:3000' by default.

## Usage
1. Open the application in your web browser.
2. Import a text file containing your program in the correct format.
   
   **Example**
   ```Example
    PGM1  START 1000
          LDA   ALPHA
          MUL   BETA
          STA   GAMMA
    ALPHA WORD  2
    BETA  WORD  4
    GAMMA RESW  1
          END   1000
   ```
3. Click on "Pass One" Button to get the output for Pass 1
4. Click on "Pass Two" Button to get the output for Pass 2
5. View the generated object program and any relevant output on the UI.

## Dependencies
* NodeJS
* npm

