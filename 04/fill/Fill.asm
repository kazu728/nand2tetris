// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

@8192
D=A

@pixel_end
M=D

@R0
M=0

(LOOP)
  @KBD
  D=M
  @KEY_PRESS
  D;JNE

  (KEY_PRESS_END)
  @R1
  M=0
  @IS_CHANGED
  0;JMP

  (KEY_PRESS)
  @R1
  M=1

  (IS_CHANGED)
  @R0
  D=M
  @R1
  D=D-M

  @LOOP
  D;JEQ
  @i
  M=0
  @R1
  D=M
  @R0
  M=D
  @EMPTY_SCREEN_LOOP
  D;JEQ

  (FILL_SCREEN_LOOP)
    @i
    D=M
    @pixel_end
    D=M-D
    @LOOP
    D;JLT

    @SCREEN
    A=A+D
    M=-1
    @i
    MD=M+1
    @FILL_SCREEN_LOOP
    0;JMP
  
  (EMPTY_SCREEN_LOOP)
    @i
    D=M
    @pixel_end
    D=M-D
    @LOOP
    D;JLT
    @SCREEN
    A=A+D
    M=0
    @i
    MD=M+1
    
    @EMPTY_SCREEN_LOOP
    0;JMP