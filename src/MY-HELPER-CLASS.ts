const mime = require('mime-types');

export class My_Helper {

  public static SUCCESS_RESPONSE( successMessage ) {
    return { success : true  , message : successMessage };
  }

  public static FAILED_RESPONSE( errorMessage ) {
    return { success : false  , message : errorMessage };
  }




////  paths
 public static teacherImagesPath = './uploads/profileImages/teachers/';
 public static studentImagesPath = './uploads/profileImages/students/';

 public static specialitiesImagesPath = './uploads/images/specialities/';
 public static newsFiles = './uploads/files/news/';
 public static modulesImagesPath = './uploads/images/modules/'
 public static chaptersFilesPath = './uploads/files/chapters/';
//// end with paths



 //// {Helper Functions }
 public static is_Image( mimetype) : boolean { 
  const imageExtinctions = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp', 
  ];
   return imageExtinctions.includes(mimetype);  
 }

public static fileExtinction ( mimetype ) : string {
  let mimetypeAsString = mimetype.toString();
  let fileExtinction = mime.extension(mimetype);
  return '.'+fileExtinction;
}

// i reckon that any lecture must be {.pdf , .doc , }
public static is_Lecture ( mimetype  ) : boolean { 
  const lecture_Extinctions = [
    '.pdf',
    '.ppt' , 
  ];
  return lecture_Extinctions.includes(My_Helper.fileExtinction( mimetype ));
}

public  static isXLSX_File( mimetype ) : boolean {
  return this.fileExtinction(mimetype) == ".xlsx";
}

 //// { End Helper Functions }


}