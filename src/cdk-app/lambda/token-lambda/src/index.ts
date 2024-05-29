import dataSource from './data-source';

export const handler = async (event: any, context: any) => {
  try {
    await dataSource.initialize();

    const entityManager = dataSource.manager;

    // Fetch all users from the database using a raw SQL query
    const expiredRefreshTokens = await entityManager.query(
      'SELECT * FROM refresh_token WHERE refresh_token.expires_at < NOW()',
    );
    console.log(expiredRefreshTokens, 'expiredRefreshTokens');
    if (expiredRefreshTokens.length === 0) {
      console.log('No expired refresh tokens found');
      return 'No expired refresh tokens found';
    }

    await entityManager.query(
      'DELETE FROM refresh_token WHERE refresh_token.expires_at < NOW()',
    );

    return 'Expired refresh tokens deleted successfully';
  } catch (err) {
    console.log('Err', err);

    throw new Error('Failed to delete expired refresh tokens');
  } finally {
    await dataSource.destroy();
  }
};
