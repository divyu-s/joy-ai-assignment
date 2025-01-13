import { Component } from '@angular/core';
import {
  APP_CONSTANT,
  Error,
  ROLE,
  ROLE_MAPPING,
} from 'src/app/constants/app-constant';
import { AppUtilService } from 'src/app/services/app-util.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  parsedData: string[] = [];
  errors: Error[] = [];
  APP_CONSTANT = APP_CONSTANT;

  constructor(private utilService: AppUtilService) {}

  /**
   * Method to import a csv file
   * @param event
   * @returns
   */
  importCSV(event: Event) {
    this.selectedFile = null;
    this.parsedData = [];
    this.errors = [];
    const input = event.target as HTMLInputElement;

    if (this.utilService.isEmpty(input.files)) {
      return;
    }

    this.selectedFile = input.files[0];
    this.readCSVFile(this.selectedFile);
  }

  /**
   * Method to read a CSV file
   * @param file
   */
  readCSVFile(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result as string;

      // Parse the CSV content
      this.parseCSV(fileContent);
    };

    reader.onerror = () => {
      alert('Could not read the file. Please try again.');
    };

    reader.readAsText(file);
  }

  /**
   * Method to parse a CSV file content
   * @param content
   */
  parseCSV(content: string): void {
    const lines = content.split('\n').map((line) => line.trim());

    // Assuming the first line is the header
    // Remaining lines are data
    this.parsedData = lines.slice(1);

    this.validateHierarchy(this.parsedData);
  }

  /**
   * Method to validate Hierarchy
   * @param parsedData
   */
  validateHierarchy(parsedData: string[]) {
    const mappingObj = new Map<string, { fullName: string; role: string }>();
    const roleValidationRules = {
      ROOT: (reportsTo: string) => this.utilService.isEmpty(reportsTo),
      ADMIN: (reportsTo: string, parentRole: string) =>
        parentRole === ROLE.ROOT,
      MANAGER: (reportsTo: string, parentRole: string) =>
        parentRole === ROLE.ADMIN || parentRole === ROLE.MANAGER,
      CALLER: (reportsTo: string, parentRole: string) =>
        parentRole === ROLE.MANAGER,
    };

    // Populate mappingObj for quick lookup
    parsedData.forEach((line) => {
      if (this.utilService.isEmpty(line)) {
        return;
      }

      const [email, fullName, role] = line.split(',');
      mappingObj.set(email, { fullName, role });
    });

    // Iterate and validate
    parsedData.forEach((line, index) => {
      if (this.utilService.isEmpty(line)) {
        return;
      }

      const [email, fullName, role, reportsTo] = line.split(',');
      const row = index + 1;

      // Validate ROOT role
      if (role === ROLE.ROOT && !roleValidationRules.ROOT(reportsTo)) {
        this.addError(row, email, fullName, role, reportsTo);
        return;
      }

      const parents = reportsTo?.split(';');
      if (parents?.length > 1) {
        // Handle multiple parents
        this.addError(
          row,
          email,
          fullName,
          role,
          reportsTo,
          APP_CONSTANT.MULTIPLE_PARENT
        );

        parents.forEach((parent) => {
          const parentRole = mappingObj.get(parent)?.role;
          if (!roleValidationRules[ROLE_MAPPING[role]](parent, parentRole)) {
            this.addError(
              row,
              email,
              fullName,
              role,
              mappingObj.get(parent),
              APP_CONSTANT.ADDITIONAL_ERROR
            );
          }
        });
      } else {
        // Single parent validation
        const parentRole = mappingObj.get(reportsTo)?.role;
        if (!roleValidationRules[ROLE_MAPPING[role]](reportsTo, parentRole)) {
          this.addError(row, email, fullName, role, mappingObj.get(reportsTo));
        }
      }
    });
  }

  /**
   * Method to collect errors
   * @param row
   * @param email
   * @param name
   * @param role
   * @param reportsTo
   * @param type
   */
  addError(
    row: number,
    email: string,
    name: string,
    role: string,
    reportsTo: any,
    type = APP_CONSTANT.GENERAL_ERROR
  ) {
    this.errors.push({ row, email, name, role, reportsTo, type });
  }
}
