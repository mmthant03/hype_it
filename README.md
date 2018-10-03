Assignment 4 - Real Web Apps: Designing for an Area of Life  
===

This assignment is intended to provide a semi-structured setting in which teams or individuals can exercise and hone their web development skills, while obtaining deeper experience in a predefined area.

The baseline aims of this assignment involve creating an application that demonstrates significant portions of all concepts covered in prior assignments, such as persistence, events, servers, etcetera.
The educational focus of this assignment is on developing a deeper skillset in a predefined area, for example social media applications.

You may use code from prior assignments.
However, you must indicate that you have done so clearly on your Readme, including links to any prior repos referenced.
Also, you may not *re-use* any tech or design achievements; these should always be new.

Baseline Requirements
---

In this assignment, your baseline requirement is to have a fully functional, deployed and web accessible application.
This application must include:

- Persistence using a database
- Event-based interaction on the front-end
- HTML CSS and JS as needed
- A well-organized server, if not using serverless architectures

Main Requirements
---

Given the sparse baseline requirements, most of your time should be focused on developing an application that operates within one of the A4 project areas:

- Security: Create an application that provides some form of a robust user experience while maintaining the highest possible security standards. Apps in the real world that meet this requirement include Signal, or Keybase.
- Games: Design and implement an interesting game mechanic as part of a fully functional web application. Recreations of classic games and well-known game mechanics will not recieve many points- focus instead on exploring an original idea.
- Social Media: Design and Prototype a new form of social media. In theory, conversations online could be as diverse in structure and form as they are in real life. In practice, social media platforms often restrict multiple types of conversations to the same form (comments, likes, tweets, etcetera). Groups in this area should explore new ways to have forms of conversation online.
- Commerce: There are many existing libraries for payments and store management. Groups in this area might create a store for a particular type of item or service. (Don't create a store for any goods or services that will get your professor- and you- in trouble. You can always re-use the code later.)
## Hype It | Social Media | a4-hypeit.herokuapp.com
`Myo Min Thant` `Taehyun Kim` `Stephanie Racca` `Adam Camilli`

HypeIt is a full stacked web application where anyone is encouraged to make
a post fast and simple.
Anyone can make a post on shoes and other people can up-vote or down-vote on the post.
Shoes are ordered by up-vote counts.
Users can get link, manufacturer, image, and product name of the shoes.

## Technical Achievements
- **Tech Achievement 1**: adding database as a remote PostgreSQL using Heroku addon
- **Tech Achievement 2**: adding image processing server Cloudinary with Heroku addon
- **Tech Achievement 3**: Transfer image data using Javascript FormData object.
- **Tech Achievement 4**: Applied multiparty modules to decode the FormData object.
- **Tech Achievement 5**: Using external API with API key method and declaring environment variable.

### Design/Evaluation Achievements
- **Design Achievement 1**: Google's `material.io` was used to make html look cleaner and easy to navigate 
- **Design Achievement 2**: Event based interaction to capture user error (ex. If user uploads something other than image file they will get an error message)