import bcrypt from "bcrypt"

export async function compararContraseña(passwordDB, passwordFront) {
    const coinciden = await bcrypt.compare(passwordFront, passwordDB);
  
    return coinciden;
  }