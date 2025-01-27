/*
  Warnings:

  - A unique constraint covering the columns `[otpSecret]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `otpSecret` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `isActivated` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `otpSecret` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_otpSecret_key` ON `users`(`otpSecret`);
