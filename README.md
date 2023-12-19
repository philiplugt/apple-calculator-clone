# Making an Apple calculator clone

This project is an attempt to clone the Apple Mac OSX calculator app. It was done with the intention to practice and improve my web programming skills. 

<div align="center">
    <img width="600" alt="apple_calculator_clone" src="https://github.com/pxv8780/apple-calculator-clone/assets/22942635/014c693b-87d9-4dc5-835c-caf5a878cbc1">
    <p><sup>Clone and original calculator side by side</sup></p>
    <br>
</div>

### Versioning
Successfully tested and run on Firefox and Safari (2023-12-16)

### How to use
Download all files to a folder of your choosing, and run `calculator.html` in your browser.

### Details
I started the project because I thought it would be easy, but it quickly became quite complex. As it turns out calculator have quite a bit of complex logical behind them.

I am not talking about solving math expressions. These quite trivial if you follow the PEMDAS/BEDMAS method. You can even cheat a little and use something like an `eval` function. However, Apple's calculator does not have parenthesis, so the logic is a bit more complex. In this case you might decide to use a stack or a queue and evaluate a equation like that, using regular (i.e. `2 + 3 * 4`) or even polish notation (`2 3 4 + *`).

Initially, I thought I could get away with using if/else and switch/case statements. I quickly realize there were too many cases to reliably keep track of the expression. It became confusing really fast.

Something reminded me of Computational Theory, Automata, and FSM (Finite State Machines) as I was working on this problem. I realize there might a solution. I did some research while attempting to solve the same problem (see [Sources](#Sources) below). While I referenced these posts to figure out the logic, I also scrutinized it to get my own answer and apply my own style of programming in making a calculator. Given the complexity of the final FSM for the Apple calculator I have no doubt that the author, as well as I, have errors or logics differences in how we handle certain cases. 

In fact as it turns out there are **major** discrepancies between the Apple IOS calculator and Apple OSX calculator. While the OSX calculator as many useful features like Scientific and Programmer modes, the IOS calculator seems to have more stable logic regarding basic calculations, though it is hard to determine without access to Apple's source code or designers. For example, something like IOS `2 + 5 * ± 3 =` will equate to `2 + 5 * -3` and yield `-13` as an answer. While on OSX `2 + 5 * ± 3 =` yields `-10`, presumably because the expression it ignores the 2 and equates to `5 * -3 + 5` 

Besides the calculator logic. I tried to faithfully copy the calculator as much as I could. For the watchful eye, you will notice some subtle differences, such as:

- Only the basic calculator is implemented, so no advanced features
- Floating point errors are not dealt because I use `parseFloat` to quickly convert between strings and numbers. So, annoyingly, expressions like `8.075 - 6 = 2.0749999999999993` instead of `2.075`
- The font is different, this project simply used Arial
- The number on the display does not decrease in font size as the maximum width is reached, it overflows instead
- No keyboard shortcuts have been implemented
- The original calculator has a slightly transparent and blurred background

### Sources and useful links

https://rvunabandi.medium.com/making-a-calculator-in-javascript-64193ea6a492
https://fsharpforfunandprofit.com/posts/calculator-complete-v2/
